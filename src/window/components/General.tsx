import { useAppState } from "../state";

export const General = () => {
	const [state, setState] = useAppState();

	const autoDownload = state.config.autoDownload;

	const toggleAutoDownload = () => {
		state.config.autoDownload = !autoDownload;
		setState({ ...state });
	};

	return (
		<>
			<h3>General</h3>
			<label style="display: flex; gap: .5em">
				<input
					type="checkbox"
					checked={autoDownload}
					onChange={toggleAutoDownload}
				/>
				Auto-Download
			</label>
		</>
	);
};