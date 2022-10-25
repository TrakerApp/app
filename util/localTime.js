import moment from "moment";

export const localTime = (timestamp) => {
	if (!timestamp) {
		return "Never";
	}
	return moment(timestamp).format("MMMM Do YYYY, hh:mm:ss a");
}
