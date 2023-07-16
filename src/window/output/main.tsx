import { render } from "preact";
import { ProvideState } from "./state";
import { Configuration } from "./components/Configuration";
import { OutputsPanel } from "./components/OuputsPanel";

import "./style.css";
import "water.css";

chrome.runtime.onConnect.addListener(() => {
	console.log("chrome.runtime.connected!");
});

const App = () => (
	<ProvideState>
		<Configuration/>
		<OutputsPanel/>
	</ProvideState>
);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const appRoot = document.querySelector("main")!;

render(<App/>, appRoot);

