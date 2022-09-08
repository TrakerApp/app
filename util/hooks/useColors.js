import { useContext } from "react";
import { PreferencesContext } from "../../store/context/preferences-context";

const LIGHT_COLORS = {
	helpText500: "#999",
	normalBackground: "#f2f2f2",
	normalBorder: "#c8c8c8",
	modalBackground: "white",
}

const DARK_COLORS = {
	helpText500: "#999",
	normalBackground: "#010101",
	modalBackground: "#333",
	normalBorder: "#313131",
}


export default useColors = () => {
	const { isThemeDark } = useContext(PreferencesContext);
	const colors = isThemeDark ? DARK_COLORS : LIGHT_COLORS

	return colors;
}
