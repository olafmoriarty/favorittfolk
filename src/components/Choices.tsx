import { useState, useEffect } from 'react'
import { Candidate } from '../types/types';
import Choice from './Choice';

const Choices = () => {
	const [options, setOptions] = useState([] as Candidate[]);

	const submitChoice = async ( pageid : number ) => {
		const ids = [ ...options.map(el => el.pageid) ];
		setOptions([]);
		const body = {
			selected: pageid,
			options: ids,
		};
		const res = await fetch('https://favorittfolk.no/api.php', {
			method: 'POST',
			body: JSON.stringify(body),
		});
		const json = await res.json();
		if (Array.isArray(json)) {
			setOptions(json);
		}
	
	}

	useEffect(() => {
		const abortController = new AbortController();

		const getOptions = async () => {
			setOptions([]);
			const res = await fetch('https://favorittfolk.no/api.php', { signal: abortController.signal });
			const json = await res.json();
			setOptions(json);
		}
	
		getOptions();

		return () => {
			abortController.abort();
		}
	}, []);

  return (
    <>
		<section className="bg-slate-100 max-h-full grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 p-4 gap-4 grow">{
			options.map(el => <Choice candidate={el} onSubmit={submitChoice} />)
		}</section>
    </>
  )

}

export default Choices;