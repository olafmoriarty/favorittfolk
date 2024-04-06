import { useState } from "react";

import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Header = (props : {setMode : ( mode : "list"|"vote"|"about"|"search" ) => void}) => {

	const [showMenu, setShowMenu] = useState(false);

	return (
	<header className="p-4 md:flex justify-between bg-slate-900 text-slate-50">
		<div className="flex justify-between">
		<h1 className="text-lg font-bold">Norske favorittfolk</h1>
		<button className="block md:hidden px-2" onClick={() => setShowMenu(beforeToggle => !beforeToggle)}><Icon icon={faBars} /></button>
		</div>
		<div className={`flex flex-col md:flex-row gap-4 mt-4 md:mt-0 ${showMenu ? 'flex' : 'hidden'} md:flex`}>
			<button className="block underline text-left" onClick={() => {
				props.setMode('vote');
				setShowMenu(false);
			}}>Stem</button>
			<button className="block underline text-left" onClick={() => {
				props.setMode('list');
				setShowMenu(false);
			}}>Toppliste</button>
			<button className="block underline text-left" onClick={() => {
				props.setMode('search');
				setShowMenu(false);
			}}>Søk</button>
			<button className="block underline text-left" onClick={() => {
				props.setMode('about');
				setShowMenu(false);
			}}>Om ...</button>
		</div>
	</header>
	)
}

export default Header;