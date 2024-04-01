import { useEffect, useState } from "react";
import getParagraphFromWikitext from '../functions/getParagraphFromWikitext'

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
			<table className="max-w-4xl mx-auto"><tbody>{topList.list.map((el, index) => <tr className="even:bg-orange-50" key={el.pageid}>
				<td className="p-2 text-right font-bold align-top">#{index + 1}:</td>
				<td className="p-2 text-left align-top"><ListMember candidate={el} index={index} /></td>
				<td className="p-2 text-right align-top">{(100 * el.votes / el.rounds).toFixed(2).replace('.', ',')}%</td>
			</tr>)}</tbody></table><p className="my-4 italic">(Personar som berre har deltatt i ein runde visast ikkje på topplista.)</p></> : null}
		</section>
		
	)
}

const ListMember = ( props : { candidate : ListMemberType, index : number } ) => {
	const [description, setDescription] = useState('');

	const el = props.candidate;

	useEffect(() => {
		const abortController = new AbortController();

		const fetchArticle = async () => {
			if (props.index >= 10) {
				return;
			}
			const res = await fetch('https://no.wikipedia.org/w/api.php?action=parse&format=json&pageid=' + props.candidate.pageid + '&prop=wikitext&formatversion=2&origin=*',
			{
				signal: abortController.signal,
			});
			const json = await res.json();
			setDescription(getParagraphFromWikitext(json.parse.wikitext));
		}
	
		fetchArticle();

		return () => {
			abortController.abort();
		}
	}, [props.candidate]);

	
	if (props.index < 10) {
		return (
			<>
			<h2><a className="text-orange-600 font-bold" href={`https://no.wikipedia.org/wiki/${encodeURI(el.title.replace(/ /g, "_"))}`} target="_blank">{el.title}</a></h2>
			<p className="text-xs">{description}</p>
			<p className="text-xs font-bold">{el.votes} stemmer / {el.rounds} runder</p>
			</>
		)
	}

	return (
		<>
			<a className="text-orange-600 underline" href={`https://no.wikipedia.org/wiki/${encodeURI(el.title.replace(/ /g, "_"))}`} target="_blank">{el.title}</a>
		</>
	)
}

type ListMemberType = { 
	pageid : number, 
	title : string, 
	votes: number, 
	rounds: number, 
};

export default Top100;