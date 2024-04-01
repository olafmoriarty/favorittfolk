const About = () => {
	return (
		<section className="bg-slate-100 max-h-full p-4 grow text-center overflow-y-scroll">
			<h2 className="mb-2 font-bold text-lg">Kva er dette?</h2>
			<p className="mb-4">Dette er ei veldig uoffisiell kåring av verdas kulaste nordmann.</p>

			<h2 className="mb-2 font-bold text-lg">Korleis fungerer det?</h2>
			<p className="mb-4">Når du trykker på "Stem", får du opp fire tilfeldige nordmenn på skjermen. Trykk på den av dei du liker best. Etter det får du opp fire nye nordmenn. Trykk på den av dei du liker best. Hald fram til du går lei.</p>

			<h2 className="mb-2 font-bold text-lg">Kven kan røyste?</h2>
			<p className="mb-4">Alle som har lyst til det.</p>

			<h2 className="mb-2 font-bold text-lg">Kor mange gonger kan eg røyste?</h2>
			<p className="mb-4">Så mange du vil.</p>

			<h2 className="mb-2 font-bold text-lg">Kvar kjem personbiografiane frå?</h2>
			<p className="mb-4">Dei hentast automatisk frå Wikipedia.</p>

			<h2 className="mb-2 font-bold text-lg">Går det an å jukse?</h2>
			<p className="mb-4">Ja, og veit du korleis er det vanvittig enkelt, men eg set stor pris på det dersom du ikkje gjer det.</p>

			<h2 className="mb-2 font-bold text-lg">Kva kandidatar er det mogleg å røyste på?</h2>
			<p className="mb-4">Alle* nordmenn som har ei Wikipedia-side (pr. 28. mars 2024) - cirka 47 000 personar.</p>

			<h2 className="mb-2 font-bold text-lg">"Alle*"? Ok, kven er utelatt?</h2>
			<p className="mb-4">Eg har basert meg på Wikipedia-kategorien <a href="https://no.wikipedia.org/wiki/Kategori:Nordmenn_etter_beskjeftigelse" target="_blank" className="underline">Nordmenn etter beskjeftigelse</a>. Så dersom det er nokon som ikkje befinner seg i den kategorien, har eg ikkje fått dei med.</p>
			<p className="mb-4">Målet mitt var å ta med alle nordmenn i alle underkategoriar i den kategorien. Eg måtte imidlertid droppe kategorien "Norske lokalpolitikere", då denne var så svær og kronglete at det tok ei æve å tråle seg gjennom han.</p>

			<h2 className="mb-2 font-bold text-lg">Hey, det kom opp eit alternativ som <em>ikkje</em> er ein person!</h2>
			<p className="mb-4">Beklager. Lista over kandidatar er som sagt basert på ein Wikipedia-kategori. Og ein skulle tru at dei inneheldt berre personar, men det er ikkje tilfelle. Nokre menneske er så store at dei har fått ein eigen Wikipedia-kategori dedikert til seg, og då ligger alle bøkene dei har skrive eller songane dei har sunge eller bygningane dei har designa i same kategori. Eg har gjort ein større manuell ryddejobb, men er ganske sikker på at det er fleire eg har oversett.</p>

			<h2 className="mb-2 font-bold text-lg">Kva skal eg gjera om eg får opp ein kandidat som ikkje er ein person, eller som ikkje er norsk?</h2>
			<p className="mb-4">Du kan velja å ignorere det og klikke på noko anna - eller du kan sende meg ein e-post på olafmoriarty@gmail.com, så kan gå inn og slette dei.</p>

			<h2 className="mb-2 font-bold text-lg">Når blir avstemminga avslutta?</h2>
			<p className="mb-4">Det har eg ikkje lagt nokre planer for enno.</p>

			<h2 className="mb-2 font-bold text-lg">Kven har laga dette?</h2>
			<p className="mb-4"><a className="text-orange-600 underline" href="https://olafmoriarty.com" target="_blank">Olaf Moriarty Solstrand</a>.</p>

			<h2 className="mb-2 font-bold text-lg">Kvifor laga du det?</h2>
			<p className="mb-4">For å sjå om eg klarte det.</p>

			<h2 className="mb-2 font-bold text-lg">Kva personopplysningar lagrar du om meg når eg bruker denne sida?</h2>
			<p className="mb-4">Ingen. (Vel, nesten. Alle webservarar har ein logg som viser kva IP-adresser som har vore innom. Eg har ingen interesse av den informasjonen, men aner ikkje korleis eg slår det av.)</p>

			<h2 className="mb-2 font-bold text-lg">Er det nokre cookies her?</h2>
			<p className="mb-4">Nei.</p>

			<h2 className="mb-2 font-bold text-lg">Ligger kjeldekoden til dette prosjektet på GitHub?</h2>
			<p className="mb-4">Ja, her: <a className="text-orange-600 underline" href="https://github.com/olafmoriarty/favorittfolk" target="_blank">https://github.com/olafmoriarty/favorittfolk</a></p>

		</section>
	)
}

export default About;