import OccurrenceModel from "./occurrence"

export default class TrackingModel {
	constructor({ id, name, occurrences }) {
		this.id = id
		this.name = name
		this.occurrences = occurrences?.map(ocr => new OccurrenceModel(ocr))
	}

	track() {
		const currentOccurrences = this.occurrences || []
		this.occurrences = [new OccurrenceModel({ id: Date.now(), time: new Date() }), ...currentOccurrences]
	}

	lastOccurrence() {
		return this.occurrences?.[0]
	}

	lastOccurrenceTime() {
		return this.lastOccurrence()?.time
	}
}
