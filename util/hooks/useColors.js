import { useContext } from "react";
import { PreferencesContext } from "../../store/context/preferences-context";

const LIGHT_COLORS = {
	helpText500: "#999",
	modalBackground: "white",
}

const DARK_COLORS = {
	helpText500: "#999",
	modalBackground: "#333",
}

export default useColors = () => {
	const { isThemeDark } = useContext(PreferencesContext);
	const colors = isThemeDark ? DARK_COLORS : LIGHT_COLORS

	return colors;
}
