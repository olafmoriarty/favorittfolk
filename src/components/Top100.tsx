import { useEffect, useState } from "react";
import TopList from "./TopList";

const Top100 = () => {
	const [topList, setTopList] = useState({} as { votes?: number, list?: { pageid: number, title: string, votes: number, rounds: number }[] });

	useEffect(() => {
		const fetchList = async () => {
			const res = await fetch('https://favorittfolk.no/api.php?mode=list');
			const json = await res.json();
			setTopList(json);
		}
		fetchList();
	}, []);

	return (
		<section className="bg-slate-100 max-h-full p-4 grow text-center overflow-y-scroll">
			<p className="mb-4">Bli med på å røyste fram dine norske favorittfolk! Trykk på "Om" for å lese korleis, eller "Stem" for å setja i gong!</p>
			{topList.list ? <>
			<p className="mb-4">Etter <strong>{topList.votes || 0}</strong> stemmer ser topplista sånn ut:</p>
			<TopList list={topList.list} />
			<p className="my-4"><a href="https://bsky.app/profile/favorittfolk.no" className="underline text-orange-800" target="_blank">Følg Favorittfolk.no på Bluesky!</a></p></> : null}
		</section>
		
	)
}

export default Top100;