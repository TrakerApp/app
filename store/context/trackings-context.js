import { createContext, useState } from "react";
import TrackingModel from "../../models/tracking.model";

export const TrackingsContext = createContext({
  trackings: [],
  addTracking: ({ name }) => {},
  editTracking: ({ id, name }) => {},
  track: ({ id }) => {},
  fetchTrackings: async () => {},
  findTracking: async (id) => {},
});

export default function TrackingsContextProvider({ children }) {
  const [trackings, setTrackings] = useState([]);

  const addTracking = ({ name }) => {
    setTrackings((trackings) => [
      ...trackings,
      new TrackingModel({
        id: Math.random().toString(),
        name,
        occurrences: [],
      }),
    ]);
  };

  const editTracking = ({ id, name }) => {
    setTrackings((trackings) => {
      const tracking = trackings.find((t) => t.id === id);
      tracking.name = name;
      return [...trackings];
    });
  };

  const track = ({ id }) => {
    setTrackings((trackings) => {
      const tracking = trackings.find((t) => t.id === id);
      tracking.track();
      return [...trackings];
    });
  };

  const fetchTrackings = async () => {
    setTrackings(TrackingModel.all());
  };

  const findTracking = async (id) => {
    return TrackingModel.find(id);
  }

  const value = {
    trackings,
    addTracking,
    editTracking,
    track,
    fetchTrackings,
    findTracking,
  };

  return (
    <TrackingsContext.Provider value={value}>
      {children}
    </TrackingsContext.Provider>
  );
}
