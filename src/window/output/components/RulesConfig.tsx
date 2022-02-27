import { IState } from "../State";
import { CapRules } from "./CapRules";
import { PatchRules } from "./PatchRules";

interface Props {
	title: string
	type: keyof IState["config"]["rules"]
}

export const RulesConfig = ({ title, type }: Props) => {
	return (
		<div class="field" style="margin-top: 1em">
			<h3>{title}</h3>
			<PatchRules type={type}/>
			<CapRules type={type}/>
		</div>
	);
};