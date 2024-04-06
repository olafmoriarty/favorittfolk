import { useState } from "react";
import Choices from "./components/Choices"
import Header from "./components/Header"
import Top100 from "./components/Top100";
import About from "./components/About";
import Search from "./components/Search";

function App() {
	const [mode, setMode] = useState('list' as 'list'|'vote'|'about'|'search');
	return(
		<div className="h-screen max-h-screen overflow-hidden flex flex-col">
			<Header setMode={setMode} />
			{mode === 'about' ? <About /> : (mode === 'vote' ? <Choices /> : (mode === 'search' ? <Search /> : <Top100 />)) }
		</div>
	)
}

export default App
