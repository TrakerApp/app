export const localTime = (timestamp) => {
	if (!timestamp) {
		return "Never";
	}
	const date = new Date(timestamp);
	const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" };
	return date.toLocaleDateString("en-US", options);
}
