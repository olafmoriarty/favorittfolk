import { useEffect, useState } from "react";
import { Candidate } from "../types/types";

const Search = () => {
	const [q, setQ] = useState('');
	const [result, setResult] = useState([] as Candidate[]);
	const [title, setTitle] = useState('');
	const [stats, setStats] = useState(undefined as {
		votes: number,
		rounds: number,
		place: number,
		sharedWith: number,
	}|undefined );

	useEffect(() => {
		const abortController = new AbortController();
		const fetchSuggestions = async () => {
			if (q.length < 3) {
				setResult([]);
				return;
			}
			const res = await fetch(`https://favorittfolk.no/api.php?q=${encodeURIComponent(q)}`);
			const json = await res.json();
			setResult(json);
		}
		fetchSuggestions();
		return () => {
			abortController.abort();
		}
	}, [q]);

	const getStats = async ( pageID : number ) => {
		setStats(undefined);

		const res = await fetch(`https://favorittfolk.no/apicopy.php?id=${pageID}`);
		const json = await res.json();

		setStats(json);
	}

	return (
		<section className="bg-slate-100 max-h-full p-4 grow text-center overflow-y-scroll">
			<p className="mb-2"><label htmlFor="search">Søk etter person:</label></p>
			<input type="search" id="search" className="block w-full border-2 border-slate-900 p-2" value={q} onChange={((event) => setQ(event.target.value))} />

			{result.map(el => <p className="text-left bg-white p-2"><button className="underline text-orange-600 font-bold block p-0" onClick={() => {
				setTitle(el.title);
				getStats(el.pageid);
				setQ('');
			}}>{el.title}</button></p>)}

			{title ?
			<section>
				<h2 className="text-3xl font-bold mt-8 mb-4">{title}</h2>
				{stats ? 
					<>
						<p className="text-7xl font-bold mb-2">{(stats.votes / stats.rounds * 100).toFixed(2).replace('.', ',')} %</p>
						<p className="mb-4 font-bold">{stats.votes} stemmer / {stats.rounds} runder</p>
						<p>{title} ligger for augeblikket på <strong>{stats.place}.</strong> plass</p>
						{stats.sharedWith ? <p className="italic">(saman med {stats.sharedWith} andre personar med same poengsum)</p> : null}
					</>
				: 'Laster informasjon ...'}
			</section>
			: null}
		</section>
	)
}

export default Search;