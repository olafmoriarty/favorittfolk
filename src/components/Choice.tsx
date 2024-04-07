import { useEffect, useState } from "react";

import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faWikipediaW } from "@fortawesome/free-brands-svg-icons";

import getParagraphFromWikitext from '../functions/getParagraphFromWikitext'
import { Candidate } from "../types/types";

const Choice = (props : { candidate: Candidate, onSubmit: (pageid : number) => void, }) => {

	const [description, setDescription] = useState('');
	const [image, setImage] = useState('');
	
	useEffect(() => {
		const abortController = new AbortController();
		const abortControllerText = new AbortController();

		const fetchArticle = async () => {
			const res = await fetch('https://no.wikipedia.org/w/api.php?action=parse&format=json&pageid=' + props.candidate.pageid + '&prop=wikitext&formatversion=2&origin=*',
			{
				signal: abortController.signal,
			});
			const json = await res.json();
			setDescription(getParagraphFromWikitext(json.parse.wikitext));

			// Get image
			const resText = await fetch('https://no.wikipedia.org/w/api.php?action=parse&format=json&pageid=' + props.candidate.pageid + '&prop=text&formatversion=2&origin=*',
			{
				signal: abortController.signal,
			});
			const jsonText = await resText.json();
			const htmlbody = jsonText.parse.text;

			const figures = htmlbody.match(/\<figure[^>]*\>(.*?)\<\/figure\>/);

			

			if (!figures) {
				return;
			}

			const images = figures[1].match(/\<img src="([^"]+)"/);

			if (images) {
				setImage(images[1]);
			}

		}
	
		fetchArticle();

		return () => {
			abortController.abort();
			abortControllerText.abort();
		}
	}, [props.candidate]);

	return (
		<article className="flex md:flex-col items-stretch gap-2 max-h-[calc((100vh-8.75rem)/4)] md:max-h-[calc((100vh-6.75rem)/2)]">
		<button className="relative overflow-hidden border p-4 rounded bg-slate-50 hover:bg-orange-100 grow" onClick={() => props.onSubmit(props.candidate.pageid)} key={props.candidate.pageid}>
			{image ? <img src={image} alt={`Bilde av ${props.candidate.title}`} className="absolute block w-full h-full top-0 left-0 opacity-20 object-cover z-0" /> : null}
			<h2 className="text-2xl font-bold relative z-50">{props.candidate.title}</h2>
			{description ? <p className="mt-2 text-xs md:text-base relative z-50">{description}</p> : null}
		</button>
		<p className="text-center"><a href={`https://no.wikipedia.org/wiki/${encodeURI(props.candidate.title.replace(' ', '_'))}`} target="_blank"><Icon icon={faWikipediaW} /></a></p>
		</article>
	);
}

export default Choice;