<?php

include('secrets.php');
$conn = mysqli_connect(
	$mysql_host, 
	$mysql_user,
	$mysql_pass,
	$mysql_db
);

$c = [];

function get_candidates() {
	global $conn;

	// 10 % chance of returning four top 50 characters
	$type_of_seed = rand(0, 9);

	if ($type_of_seed === 0) {
		// Get four top 50 characters

		$query = 'SELECT title, pageid FROM folk WHERE rounds > 0 ORDER BY (votes / rounds) DESC LIMIT 50';
		$stmt = $conn->prepare($query);
		$stmt->execute();
		$result = $stmt->get_result();
		$stmt->close();
	
		$all = [];
		while ($row = $result->fetch_assoc()) {
			$all[] = $row;
		}

		$random_keys = array_rand($all, 4);
		$c = [];
		foreach ($random_keys as $key) {
			$c[] = $all[$key];
		}

		return $c;
	}

	$c = [];

	if ($type_of_seed < 4) {
		// Get one "one away" candidate
		$query = 'SELECT title, pageid FROM folk WHERE votes > 0 ORDER BY (rounds - votes) ASC, RAND() LIMIT 1';
		$stmt = $conn->prepare($query);
		$stmt->execute();
		$result = $stmt->get_result();
		$stmt->close();

		while ($row = $result->fetch_assoc()) {
			$c[] = $row;
		}

	}
	else {
		// Get one top 50 candidate
		$random_number = rand(0, 49);
		$query = 'SELECT title, pageid FROM folk WHERE rounds > 0 AND rounds <= (SELECT rounds FROM folk ORDER BY rounds DESC LIMIT 21, 1) ORDER BY (votes / rounds) DESC LIMIT ?, 1';
		$stmt = $conn->prepare($query);
		$stmt->bind_param('i', $random_number);
		$stmt->execute();
		$result = $stmt->get_result();
		$stmt->close();

		while ($row = $result->fetch_assoc()) {
			$c[] = $row;
		}

	}

	// Get two least rated candidates
	$query = 'SELECT title, pageid FROM folk';
	if (count($c)) {
		$query .= ' WHERE pageid != ' . $c[0]['pageid'];
	}
	$query .= ' ORDER BY rounds ASC, RAND() LIMIT 2';
	$stmt = $conn->prepare($query);
	$stmt->execute();
	$result = $stmt->get_result();
	$stmt->close();

	while ($row = $result->fetch_assoc()) {
		$c[] = $row;
	}


	// Get 1 or 2 random candidates
	$remaining_count = 4 - count($c);
	$existing_ids = [];
	for ($i = 0; $i < count($c); $i++) {
		$existing_ids[] = $c[$i]['pageid'];
	}


	$query = 'SELECT title, pageid FROM folk WHERE pageid NOT IN (' . implode(',', $existing_ids) . ') ORDER BY RAND() LIMIT ?';
	$stmt = $conn->prepare($query);
	$stmt->bind_param('i', $remaining_count);
	$stmt->execute();
	$result = $stmt->get_result();
	$stmt->close();

	while ($row = $result->fetch_assoc()) {
		$c[] = $row;
	}
	shuffle($c);
	return $c;
}


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
	// Returner toppliste
	if (isset($_GET['mode']) && $_GET['mode'] === 'list') {
		$query = 'SELECT title, pageid, votes, rounds FROM folk WHERE ';
		if (isset($_GET['ids']) && preg_match('/^(?:\d+,)*\d+$/', $_GET['ids'])) {
			$query .= 'pageid IN (' . $_GET['ids'] . ') AND ';
		}
		$query .= 'rounds > 1';
		$query .= ' ORDER BY (votes / rounds) DESC, rounds DESC, title LIMIT 100';
		$stmt = $conn->prepare($query);
		$stmt->execute();
		$result = $stmt->get_result();
		$stmt->close();
		$c['list'] = [];
		while ($row = $result->fetch_assoc()) {
			$c['list'][] = $row;
		}
		$query = 'SELECT SUM(votes) as votecount FROM folk';
		$stmt = $conn->prepare($query);
		$stmt->execute();
		$result = $stmt->get_result();
		$stmt->close();
		$row = $result->fetch_assoc();
		$c['votes'] = $row['votecount'];
	}

	elseif (isset($_GET['q'])) {
		$words = explode(' ', $_GET['q']);

		$wordcount = count($words);

		$where = [];
		$sssss = '';
		$real_words = [];

		for ($i = 0; $i < $wordcount; $i++) {
			if ($words[$i]) {
				$where[] = 'title LIKE ?';
				$sssss .= 's';
				$real_words[] = '%' . $words[$i] . '%';
			}
		}

		if (count($real_words)) {
			$query = 'SELECT pageid, title FROM folk WHERE ' . implode(' AND ', $where) . ' ORDER BY votes / rounds DESC LIMIT 10';
			$stmt = $conn->prepare($query);
			$stmt->bind_param($sssss, ...$real_words);
			$stmt->execute();
			$result = $stmt->get_result();
			$stmt->close();

			while ($row = $result->fetch_assoc()) {
				$c[] = $row;
			}
		}
	}

	elseif (isset($_GET['id']) && is_numeric($_GET['id'])) {
		$query = 'SELECT votes, rounds FROM folk WHERE pageid = ? LIMIT 1';
		$stmt = $conn->prepare($query);
		$stmt->bind_param('i', $_GET['id']);
		$stmt->execute();
		$result = $stmt->get_result();
		$stmt->close();

		if ($result->num_rows) {
			$row = $result->fetch_assoc();
			$c['votes'] = $row['votes'];
			$c['rounds'] = $row['rounds'];

			// Place
			$query = 'SELECT COUNT(pageid) AS higherThan FROM folk WHERE (votes / rounds) > (? / ?) OR ((votes / rounds) = (? / ?) AND votes > ?)';
			$stmt = $conn->prepare($query);
			$stmt->bind_param('iiiii', $c['votes'], $c['rounds'], $c['votes'], $c['rounds'], $c['votes']);
			$stmt->execute();
			$result = $stmt->get_result();
			$stmt->close();
			$row = $result->fetch_assoc();
			$c['place'] = $row['higherThan'] + 1;

			// SharedWith
			$query = 'SELECT COUNT(pageid) AS sharedWith FROM folk WHERE votes = ? AND (rounds = ? OR votes = 0)';
			$stmt = $conn->prepare($query);
			$stmt->bind_param('ii', $c['votes'], $c['rounds']);
			$stmt->execute();
			$result = $stmt->get_result();
			$stmt->close();
			$row = $result->fetch_assoc();
			$c['sharedWith'] = $row['sharedWith'] - 1;
		}
	}

	else {
		$c = get_candidates();
	}

}

else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$body = json_decode(file_get_contents("php://input"), true);

	if (!isset($body['selected']) || !is_int($body['selected']) || !isset($body['options']) || !is_array($body['options']) || count($body['options']) !== 4 || !in_array($body['selected'], $body['options'])) {
		$c = ['error' => 'Ugyldige parametre'];
	}
	else {
		$options = $body['options'];
		$integer_count = 0;
		foreach ($options as $val) {
			if (is_int($val)) {
				$integer_count++;
			}
		}

		if ($integer_count < count($options)) {
			$c = ['error' => 'Ugyldige parametre'];
		}
		else {
			
			// Add score here
			$query = 'UPDATE folk SET rounds = rounds + 1 WHERE pageid IN (' . implode(',', $options) . ')';
			$stmt = $conn->prepare($query);
			$stmt->execute();
			$result = $stmt->get_result();
			$stmt->close();

			$query = 'UPDATE folk SET votes = votes + 1 WHERE pageid = ?';
			$stmt = $conn->prepare($query);
			$stmt->bind_param('i', $body['selected']);
			$stmt->execute();
			$result = $stmt->get_result();
			$stmt->close();

			$c = get_candidates();
		}
	}
}

// Set HTTP headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Accept, Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');

// Set HTTP status (adapt to actual content)
header("HTTP/1.0 200 OK");

// Output content as JSON
echo json_encode($c);