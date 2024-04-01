import { useEffect, useState } from "react";

import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faWikipediaW } from "@fortawesome/free-brands-svg-icons";

import getParagraphFromWikitext from '../functions/getParagraphFromWikitext'
import { Candidate } from "../types/types";

const Choice = (props : { candidate: Candidate, onSubmit: (pageid : number) => void, }) => {

	const [description, setDescription] = useState('');
	
	useEffect(() => {
		const abortController = new AbortController();

		const fetchArticle = async () => {
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

	return (
		<article className="flex md:flex-col items-stretch gap-2 max-h-[calc((100vh-8.75rem)/4)] md:max-h-[calc((100vh-6.75rem)/2)]">
		<button className="overflow-hidden border p-4 rounded bg-slate-50 hover:bg-orange-100 grow" onClick={() => props.onSubmit(props.candidate.pageid)} key={props.candidate.pageid}>
			<h2 className="text-2xl font-bold">{props.candidate.title}</h2>
			{description ? <p className="mt-2 text-xs md:text-base">{description}</p> : null}
		</button>
		<p className="text-center"><a href={`https://no.wikipedia.org/wiki/${encodeURI(props.candidate.title.replace(' ', '_'))}`} target="_blank"><Icon icon={faWikipediaW} /></a></p>
		</article>
	);
}

export default Choice;