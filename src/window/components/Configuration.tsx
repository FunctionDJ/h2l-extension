import { General } from "./General";
import { RulesConfig } from "./RulesConfig";

export const Configuration = () => (
	<section>
		<h2>Configuration</h2>
		<General/>
		<RulesConfig title="Artist rules" type="artists"/>
		<RulesConfig title="Label rules" type="labels"/>
	</section>
);