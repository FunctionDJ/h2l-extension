import { ComponentChildren, createContext } from "preact";
import { StateUpdater, useContext, useState } from "preact/hooks";
import { Rules } from "../../../types";

export interface IState {
	config: {
		autoDownload: boolean
		rules: {
			artists: Rules
			labels: Rules
		}
	}
}

type IStateContext = [IState, StateUpdater<IState>];

const createDefaultState = (): IState => ({
	config: {
		autoDownload: true,
		rules: {
			artists: {
				capitalizations: [""],
				patches: [{ replace: "", with: "" }]
			},
			labels: {
				capitalizations: [""],
				patches: [{ replace: "", with: "" }]
			}
		}
	}
});

const State = createContext<IStateContext>([
	createDefaultState(),
	(_state) => { /* noop */ }
]);

interface Props {
	children: ComponentChildren
}

export const useAppState = () => useContext(State);

function useLocalStorage<T>(key: string, initialValue: T) {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.warn("useLocalStorage error:", error);
			return initialValue;
		}
	});

	const setValue: StateUpdater<T> = value => {
		try {
			const newValue = value instanceof Function ? value(storedValue) : value;
			setStoredValue(newValue);
			localStorage.setItem(key, JSON.stringify(newValue));
		} catch (error) {
			console.warn("useLocalStorage error:", error);
		}
	};

	return [storedValue, setValue] as [T, StateUpdater<T>];
}

export const ProvideState = ({ children }: Props) => {
	const value = useLocalStorage<IState>("state", createDefaultState());
	return <State.Provider value={value} children={children}/>;
};