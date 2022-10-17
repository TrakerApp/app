import OccurrenceModel from "./occurrence.model";
import TRACKINGS from "../data/trackings";
export default class TrackingModel {
  constructor({ id, name, occurrences }) {
    this.id = id;
    this.name = name;
    this.occurrences = occurrences?.map((ocr) => new OccurrenceModel(ocr));
  }

  static all() {
    return TRACKINGS.map((t) => new TrackingModel(t));
  }

  static find(id) {
    return this.all().find((t) => t.id === id);
  }

  track() {
    const currentOccurrences = this.occurrences || [];
    this.occurrences = [
      new OccurrenceModel({ id: Date.now(), time: new Date() }),
      ...currentOccurrences,
    ];
  }

  lastOccurrence() {
    return this.occurrences?.[0];
  }

  lastOccurrenceTime() {
    return this.lastOccurrence()?.time;
  }
}
