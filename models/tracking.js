import OccurrenceModel from "./occurrence"

export default class TrackingModel {
	constructor({ id, name, occurrences }) {
		this.id = id
		this.name = name
		this.occurrences = occurrences?.map(ocr => new OccurrenceModel(ocr))
	}

	lastOccurrence() {
		return this.occurrences?.[0]
	}

	lastOccurrenceTime() {
		return this.lastOccurrence()?.time
	}
}
