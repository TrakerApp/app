import { useContext } from "react";
import { PreferencesContext } from "../../store/context/preferences-context";

const LIGHT_COLORS = {
	helpText: "#999",
	softText1: "#333",
	normalBackground: "#f2f2f2",
	normalBorder: "#c8c8c8",
	modalBackground: "white",
	refreshIndicator: "#999",
	link: "#0e57f4",
}

const DARK_COLORS = {
	helpText: "#999",
	softText1: "#ddd",
	normalBackground: "#010101",
	modalBackground: "#333",
	normalBorder: "#313131",
	refreshIndicator: "#fff",
	link: "#7dabff",
}

export default useColors = () => {
	const { isThemeDark } = useContext(PreferencesContext);
	const colors = isThemeDark ? DARK_COLORS : LIGHT_COLORS

	return colors;
}
