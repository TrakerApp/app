import { createContext, useState, useEffect } from "react";
import TrackingModel from "../../models/tracking.model";
import TrackingsApi from "../../util/trackingsApi";
import { useAuthContext } from "./auth-context";

export const TrackingsContext = createContext({
  trackings: [],
  addTracking: async ({ name }) => {},
  editTracking: async ({ id, name }) => {},
  track: async ({ id }) => {},
  listTrackings: async ({ page, perPage }) => {},
  findTracking: async (id) => {},
});

export default function TrackingsContextProvider({ children }) {
  const [trackings, setTrackings] = useState([]);
  const authCtx = useAuthContext();

  const trackingsApi = new TrackingsApi(authCtx.currentUser.accessToken);

  const addTracking = async ({ name }) => {
    const newTracking = await trackingsApi.createTracking({ name });
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

  const listTrackings = async ({ page = 1, perPage = 10 }) => {
    const { status, data } = await trackingsApi.listTrackings({ page, perPage });
    if (status >= 300) {
      // error happened
      console.log("ERROR on listtrackings:", status)
      return data;
    } else {
      return data;
    }
  };

  const findTracking = async (id) => {
    return TrackingModel.find(id);
  };

  useEffect(() => {
    const load = async () => {
      const { trackings }  = await listTrackings({ page: 1, perPage: 10 });
      console.log("trackings:", trackings)
      setTrackings(trackings);
    };

    load();
  }, []);

  const value = {
    trackings,
    addTracking,
    editTracking,
    track,
    listTrackings,
    findTracking,
  };

  return (
    <TrackingsContext.Provider value={value}>
      {children}
    </TrackingsContext.Provider>
  );
}
