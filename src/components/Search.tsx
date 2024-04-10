import { useEffect, useState } from "react";
import { Candidate, ListMemberType } from "../types/types";
import TopList from "./TopList";

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
	const [categories, setCategories] = useState([] as string[]);
	const [currentCategory, setCurrentCategory] = useState('');

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

		const res = await fetch(`https://favorittfolk.no/api.php?id=${pageID}`);
		const json = await res.json();

		setStats(json);
	}

	const getCategories = async ( pageID : number ) => {
		const res = await fetch('https://no.wikipedia.org/w/api.php?action=parse&format=json&pageid=' + pageID + '&prop=categories&formatversion=2&origin=*');
		const json = await res.json();
		setCategories(json.parse.categories.filter((el : WikiCategory) => !el.hidden).map((el : WikiCategory) => el.category));
	}

	return (
		<section className="bg-slate-100 max-h-full p-4 grow text-center overflow-y-scroll">
			<p className="mb-2"><label htmlFor="search">Søk etter person:</label></p>
			<input type="search" id="search" className="block w-full border-2 border-slate-900 p-2" value={q} onChange={((event) => setQ(event.target.value))} />

			{result.map(el => <p className="text-left bg-white p-2"><button className="underline text-orange-600 font-bold block p-0" onClick={() => {
				setTitle(el.title);
				getStats(el.pageid);
				getCategories(el.pageid);
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
				: <p>Laster informasjon ...</p>}
				<p className="mt-4"><a className="underline text-orange-600" href={`https://no.wikipedia.org/wiki/${encodeURIComponent(title.replace(' ', '_'))}`} target="_blank">Vis Wikipedia-side</a></p>
				{
					categories.length ? 
					<>
						<h3 className="text-2xl font-bold mt-8 mb-4">Kategoriar</h3>
						<section className="flex flex-wrap gap-4 justify-center">{categories.map(el => <button className="text-sm font-bold px-2 py-1 whitespace-nowrap bg-orange-100 border rounded border-orange-800" onClick={() => setCurrentCategory(el)}>{el.replace(/\_/g, ' ')}</button>)}</section>
						{currentCategory ? <CategoryList title={currentCategory} key={currentCategory} /> : null}
					</>
					: null
				}
			</section>
			: null}
		</section>
	)
}

const CategoryList = ( props : { title : string } ) => {
	const [pages, setPages] = useState([] as ListMemberType[]);
//	const [subcats, setSubcats] = useState([] as WikiCategoryMember[]);

	useEffect(() => {
		const abortController = new AbortController();
	
		const getCategoryMembers = async () => {

			let continueString = '';
			let pageArray = [] as number[];

			do {
				const res = await fetch(`https://no.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Kategori:${encodeURIComponent(props.title)}&cmlimit=500&format=json&origin=*${continueString ? '&cmcontinue=' + continueString : ''}`, { signal: abortController.signal });
				const json = await res.json();
				pageArray.push( 
					...json
					.query
					.categorymembers
					.filter((el : WikiCategoryMember) => el.ns === 0)
					.map(
						(el : WikiCategoryMember) => el.pageid
					)
				);
				if (json.continue && json.continue.cmcontinue) {
					continueString = json.continue.cmcontinue;
				}
				else {
					continueString = '';
				}
			} while (continueString);

			let newPages = [] as ListMemberType[];
			for (let i = 0; i < Math.ceil( pageArray.length / 50 ); i++) {
				const ids = pageArray.slice(i * 50, (i + 1) * 50).join(',');
				const res = await fetch('https://favorittfolk.no/api.php?mode=list&ids=' + ids, { signal: abortController.signal });
				const json = await res.json();
				newPages.push( ...json.list );
			}
			setPages(newPages.sort((a, b) => {
				if (a.votes / a.rounds < b.votes / b.rounds) {
					return 1;
				}
				if (a.votes / a.rounds > b.votes / b.rounds) {
					return -1;
				}
				return 0;
			}));

		}
		getCategoryMembers();

		return (() => {
			abortController.abort();
		});
	}, [props.title]);


	return (
		<section>
			<h2 className="text-3xl font-bold mt-8 mb-4">{props.title.replace(/\_/g, ' ')}</h2>
			{pages.length ? <TopList list={pages} /> : <p>Laster toppliste ...</p>}
		</section>
	)
}

type WikiCategory = { category : string, sortkey? : string, hidden? : boolean };
type WikiCategoryMember = { pageid : number, ns : number, title : string };
export default Search;