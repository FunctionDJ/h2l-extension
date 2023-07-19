import { IState, useAppState } from "../state";
import { RemoveButton, AddButton } from "./Buttons";

export const CapRules = ({ type }: { type: keyof IState["config"]["rules"]}) => {
	const [state, setState] = useAppState();

	const add = () => {
		state.config.rules[type].capitalizations.push("");
		setState({ ...state });
	};

	const remove = (index: number) => {
		state.config.rules[type].capitalizations = state.config.rules[type].capitalizations.filter((_v, i) => i !== index);
		setState({ ...state });
	};

	const change = (index: number, value: string) => {
		state.config.rules[type].capitalizations[index] = value;
		setState({ ...state });
	};

	return (
		<>
			<h4>Capitalization Rules</h4>
			<div>
				{state.config.rules[type].capitalizations.map((rule, index) => (
					<div class="rule-line">
						<input
							value={rule}
							onChange={e => change(index, e.currentTarget.value)}
						/>
						{" "}
						<RemoveButton onClick={() => remove(index)}/>
					</div>
				))}
			</div>
			<AddButton onClick={add} text="Add Capitalization Rule"/>
		</>
	);
};