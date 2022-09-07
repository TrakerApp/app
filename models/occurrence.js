export default class OccurrenceModel {
	constructor({ id, time }) {
		this.id = id
		this.time = new Date(time)
	}
}
