import { useState } from "react";
import Choices from "./components/Choices"
import Header from "./components/Header"
import Top100 from "./components/Top100";
import About from "./components/About";

function App() {
	const [mode, setMode] = useState('list' as 'list'|'vote'|'about');
	return(
		<div className="h-screen max-h-screen overflow-hidden flex flex-col">
			<Header setMode={setMode} />
			{mode === 'about' ? <About /> : (mode === 'vote' ? <Choices /> : <Top100 />) }
		</div>
	)
}

export default App
