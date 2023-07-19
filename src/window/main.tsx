import { render } from "preact";
import { addListenerToServiceWorker } from "../rpc";
import { Configuration } from "./components/Configuration";
import { OutputsPanel } from "./components/OutputsPanel";
import { ProvideState } from "./state";

import "water.css";
import "./style.css";

chrome.runtime.onConnect.addListener(() => {
	console.log("chrome.runtime.connected!");
});

addListenerToServiceWorker((message) => {
	if (message.type === "error") {
		window.alert(message.message);
	}
});

const App = () => (
	<ProvideState>
		<Configuration />
		<OutputsPanel />
	</ProvideState>
);

const appRoot = document.querySelector("main")!;

render(<App />, appRoot);
