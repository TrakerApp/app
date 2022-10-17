import { createContext, useState, useEffect } from "react";
import TrackingModel from "../../models/tracking.model";
import TrackingsApi from "../../util/trackingsApi";
import { useAuthContext } from "./auth-context";

export const TrackingsContext = createContext({
  trackings: [],
  addTracking: async ({ name }) => {},
  editTracking: async ({ id, name }) => {},
  track: async ({ trackingId }) => {},
  listTrackings: async ({ page, perPage }) => {},
  findTracking: async (trackingId) => {},
  listOccurrences: async ({ trackingId, page, perPage }) => {}
});

export default function TrackingsContextProvider({ children }) {
  const [trackings, setTrackings] = useState([]);
  const authCtx = useAuthContext();

  const trackingsApi = new TrackingsApi(authCtx.accessToken);

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

  const track = async ({ trackingId }) => {
    const res = await trackingsApi.track({ trackingId });
    if (res.status === 201) {
      setTrackings((trackings) => {
        const tracking = trackings.find((t) => t.trackingId === trackingId);
        tracking.lastOccurrenceAt = res.data.lastOccurrenceAt;
        return [...trackings];
      });
    }

    return res
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

  const findTracking = async (trackingId) => {
    return await trackingsApi.getTracking({ trackingId })
  };

  const listOccurrences = async ({ trackingId, page, perPage }) => {
    return await trackingsApi.occurrences({ trackingId, page, perPage });
  }

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
    listOccurrences,
  };

  return (
    <TrackingsContext.Provider value={value}>
      {children}
    </TrackingsContext.Provider>
  );
}
