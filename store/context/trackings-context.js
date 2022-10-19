import { createContext, useState, useEffect } from "react";
import TrackingsApi from "../../util/trackingsApi";
import { useAuthContext } from "./auth-context";

export const TrackingsContext = createContext({
  trackings: [],
  createTracking: async ({ name }) => {},
  updateTracking: async ({ id, name }) => {},
  track: async ({ trackingId }) => {},
  listTrackings: async ({ page, perPage }) => {},
  findTracking: async (trackingId) => {},
  listOccurrences: async ({ trackingId, page, perPage }) => {},
});

export default function TrackingsContextProvider({ children }) {
  const [trackings, setTrackings] = useState([]);
  const authCtx = useAuthContext();

  const trackingsApi = new TrackingsApi(authCtx.accessToken);

  const createTracking = async ({ name }) => {
    const res = await trackingsApi.createTracking({ name });
    const { status, data } = res;
    console.log("result from createTracking:", status, data)

    if (status === 201) {
      setTrackings((trackings) => [
        ...trackings,
        {
          trackingId: data.trackingId,
          name,
        },
      ]);
    }

    return res;
  };

  const updateTracking = async ({ trackingId, name }) => {
    const res = await trackingsApi.updateTracking({ trackingId, name });
    const { status, data } = res;
    console.log("result from updateTracking:", status, data)

    if (status === 201) {
      setTrackings((trackings) => {
        const tracking = trackings.find((t) => t.trackingId === trackingId);
        tracking.name = name;
        return [...trackings];
      });
    }

    return res;
  };

  const track = async ({ trackingId }) => {
    const res = await trackingsApi.track({ trackingId });
    const { status, data } = res;
    console.log("result from track:", status, data)

    if (status === 201) {
      setTrackings((trackings) => {
        const tracking = trackings.find((t) => t.trackingId === trackingId);
        tracking.lastOccurrenceAt = data.createdAt;
        return [...trackings];
      });
    }

    return res;
  };

  const listTrackings = async ({ page = 1, perPage = 10 }) => {
    const { status, data } = await trackingsApi.listTrackings({
      page,
      perPage,
    });
    if (status >= 300) {
      // error happened
      console.log("ERROR on listtrackings:", status);
      return data;
    } else {
      return data;
    }
  };

  const findTracking = async (trackingId) => {
    return await trackingsApi.getTracking({ trackingId });
  };

  const listOccurrences = async ({ trackingId, page, perPage }) => {
    return await trackingsApi.occurrences({ trackingId, page, perPage });
  };

  useEffect(() => {
    const load = async () => {
      const { trackings } = await listTrackings({ page: 1, perPage: 10 });
      console.log("trackings:", trackings);
      setTrackings(trackings);
    };

    load();
  }, []);

  const value = {
    trackings,
    createTracking,
    updateTracking,
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
