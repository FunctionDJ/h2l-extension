import { IState, useAppState } from "../state";
import { RemoveButton, AddButton } from "./Buttons";

export const PatchRules = ({ type }: { type: keyof IState["config"]["rules"] }) => {
	const [state, setState] = useAppState();

	const add = () => {
		state.config.rules[type].patches.push({ replace: "", with: "" });
		setState({ ...state });
	};
	
	const remove = (index: number) => {
		state.config.rules[type].patches = state.config.rules[type].patches.filter((_v, i) => i !== index);
		setState({ ...state });
	};
	
	const changeReplace = (index: number, value: string) => {
		state.config.rules[type].patches[index].replace = value;
		setState({ ...state });
	};
	
	const changeWith = (index: number, value: string) => {
		state.config.rules[type].patches[index].with = value;
		setState({ ...state });
	};

	return (
		<>
			<h4>Patch Rules</h4>
			<div>
				{state.config.rules[type].patches.map((rule, index) => (
					<div class="rule-line">
						<input
							value={rule.replace}
							onInput={e => changeReplace(index, e.currentTarget.value)}
						/>
						<span class="point-right-arrow">&#10132;</span>
						<input
							value={rule.with}
							onInput={e => changeWith(index, e.currentTarget.value)}
						/>
						{" "}
						<RemoveButton onClick={() => remove(index)}/>
					</div>
				))}
			</div>
			<AddButton onClick={add} text="Add Patch Rule"/>
		</>
	);
};