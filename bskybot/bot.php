<?php
// This script is called automatically by a cron job every hour

// Get MySQL and Bluesky login details
include('secrets.php');

// Connect to MySQL
$conn = mysqli_connect(
	$mysql_host, 
	$mysql_user,
	$mysql_pass,
	$mysql_db
);

// Simplified function to send a CURL post request
function fetch( $url, $options = [] ) {
	if (!$url) {
		return;
	}
	$curl = curl_init();

	$headers = [
		'Content-Type: application/json',
		'Accept: application/json'
	];

	if (isset($options['token'])) {
		$headers[] = 'Authorization: Bearer ' . $options['token'];
	}

	if (isset($options['body'])) {
		$data = $options['body'];
	}

	curl_setopt_array($curl, array(
		CURLOPT_URL => $url,
		CURLOPT_RETURNTRANSFER => true,
	  	CURLOPT_ENCODING => '',
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 0,
		CURLOPT_FOLLOWLOCATION => true,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,

		CURLOPT_HTTPHEADER => $headers,
	));

	// If POST (for now, let's assume it's always POST)
	curl_setopt($curl, CURLOPT_POST, true);
	curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));

	$response = curl_exec($curl);
	
	curl_close($curl);
	return json_decode( $response, true );
}

// Get wikipedia text
function get_wikitext( $id ) {
	// Fetch JSON from wikipedia 
	$wiki_raw = file_get_contents('https://no.wikipedia.org/w/api.php?action=parse&format=json&pageid=' . $id . '&prop=wikitext&formatversion=2&origin=*');
	$wiki_json = json_decode($wiki_raw, true);
	$wikitext = $wiki_json['parse']['wikitext'];

	// Strip wikitext tags etc
	$wikitext = preg_replace('/\[\[(?!File?:)[^\|\]]+?\|([^\[\]]+?)\]\]/', '$1', $wikitext);
	$wikitext = preg_replace('/\[\[(?!File?:)([^\[\]]+?)\]\]/', '$1', $wikitext);
	$wikitext = preg_replace('/\[\[File?\:[^\[\]]+\]\]/', '', $wikitext);
	$wikitext = preg_replace('/\[\[[^\]\|]+\|(.+?)\]\]/', '$1', $wikitext);
	$wikitext = preg_replace('/\[\[(.+?)\]\]/', '$1', $wikitext);
	$wikitext = preg_replace('/\{\{Fk\|([^\{\}]+?)\}\}/', '$1', $wikitext);
	$wikitext = preg_replace('/\{\{[^\{\}]+?\}\}/', '', $wikitext);
	$wikitext = preg_replace('/\{\{[^\{\}]+?\}\}/', '', $wikitext);
	$wikitext = preg_replace('/\{\{[^\{\}]+?\}\}/', '', $wikitext);
	$wikitext = preg_replace('/\{\{[^\{\}]+?\}\}/', '', $wikitext);
	$wikitext = preg_replace('/\{\{[^\{\}]+?\}\}/', '', $wikitext);
	$wikitext = preg_replace("/\'\'\'?/", '', $wikitext);
	$wikitext = preg_replace('/\<ref[^\>]*\>[^\<]+?\<\/ref\>/', '', $wikitext);
	$wikitext = preg_replace('/\<ref[^\>]+\/\>/', '', $wikitext);
	$wikitext = preg_replace('/\<[^\>]+\>/', '', $wikitext);
	$wikitext = preg_replace('/^\:.*$/m', '', $wikitext);
	$wikitext = preg_replace('/&ndash;/', '–', $wikitext);
	$wikitext = preg_replace('/&nbsp;/', ' ', $wikitext);

	// Get first paragraph
	$wikitext = trim($wikitext);
	$wikitext_arr = explode("\n", $wikitext);
	$wikitext = $wikitext_arr[0];

	return $wikitext;
}

// Create ATProto session
function atproto_create_session($identifier, $password) {

	$res = fetch('https://bsky.social/xrpc/com.atproto.server.createSession', [
		'body' => [
			'identifier' => $identifier,
			'password' => $password,
		], 
	]);	

	return $res;
}

// The function that is called when the bot runs
function run_bot() {
	global $conn;
	global $bsky_username;
	global $bsky_password;

	// Query MySQL table for a person to post about
	$query = 'SELECT pageid, title FROM folk WHERE bsky = 0 ORDER BY (votes / rounds) DESC LIMIT 1';
	$stmt = $conn->prepare($query);
	$stmt->execute();
	$result = $stmt->get_result();
	$stmt->close();

	// Finish if no such people 
	if (!$result->num_rows) {
		return;
	}

	$row = $result->fetch_assoc();

	$title = $row['title'];
	$id = $row['pageid'];

	// Get Wikipedia text
	$wikitext = get_wikitext($id);

	// Connect to Bluesky
	$session = atproto_create_session($bsky_username, $bsky_password);

	// Generate post text
	$text = mb_strtoupper($title, 'UTF-8') . "\n" . $wikitext;

	// Split text in 300 character chunks
	$texts = [];
	while ($text) {
		if (strlen($text) > 300) {
			$length = strrpos( substr($text, 0, 300), ' ' );
			$texts[] = substr($text, 0, $length);
			$text = trim(substr($text, $length));
		}
		else {
			$texts[] = $text;
			$text = '';
		}
	}


	$texts_length = count($texts);

	$root = [];
	$parent = [];

	date_default_timezone_set('UTC');

	// For each chunk of text ...
	for ($i = 0; $i < $texts_length; $i++) {

		// Set a timestamp
		$ms = microtime();
		$ms_arr1 = explode(' ', $ms);
		$ms_arr2 = explode('.', $ms_arr1[0]);
		$timestamp = date('Y-m-d\TH:i:s.') . $ms_arr2[1] . 'Z';

		// Create a record
		$record = [
			'$type' => 'app.bsky.feed.post',
			'createdAt' => $timestamp,
			'text' => $texts[$i],
			'langs' => ["nb"],
		];

		// In first post, add a link to the Wikipedia article
		if ($i === 0) {
			$record['facets'] = [
				[
					'index' => [
						'byteStart' => 0,
						'byteEnd' => strlen($title),
					],
					'features' => [
						[
							'$type' => 'app.bsky.richtext.facet#link',
							'uri' => 'https://no.wikipedia.org/wiki/' . urlencode( str_replace(' ', '_', $title) ),
						]
					]
				],
			];
		}

		// In every post except the first, add it to the thread
		else {
			$record['reply'] = [
				'root' => $root,
				'parent' => $parent,
			];
		}

		// Post to Bluesky
		$result = fetch( 'https://bsky.social/xrpc/com.atproto.repo.createRecord', [
			'body' => [
				'repo' => $session['did'],
				'collection' => 'app.bsky.feed.post',
				'record' => $record,
			],
			'token' => $session['accessJwt'],
		] );

		// Set root and parent for the next posts
		if ($i === 0) {
			$root = $result;
		}
		$parent = $result;
	}

	// Update MySQL table to avoid this person showing up again
	$query = 'UPDATE folk SET bsky = 1 WHERE pageid = ?';
	$stmt = $conn->prepare($query);
	$stmt->bind_param('i', $id);
	$stmt->execute();
	$result = $stmt->get_result();
	$stmt->close();
}

run_bot();