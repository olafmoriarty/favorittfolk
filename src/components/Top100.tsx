import { useEffect, useState } from "react";

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
			<table className="max-w-full mx-auto"><tbody>{topList.list.map((el, index) => <tr className="even:bg-orange-50" key={el.pageid}>
				<td className="p-2 text-right font-bold">#{index + 1}:</td>
				<td className="p-2 text-left"><a className="text-orange-600" href={`https://no.wikipedia.org/wiki/${encodeURI(el.title.replace(/ /g, "_"))}`} target="_blank">{el.title}</a></td>
				<td className="p-2 text-right">{(100 * el.votes / el.rounds).toFixed(2).replace('.', ',')} %</td>
			</tr>)}</tbody></table><p className="my-4 italic">(Personar som berre har deltatt i ein runde visast ikkje på topplista.)</p></> : null}
		</section>
		
	)
}

export default Top100;