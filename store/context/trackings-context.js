import { createContext, useState, useEffect } from "react";
import TrackingsApi from "../../util/trackingsApi";
import { useAuthContext } from "./auth-context";

export const TrackingsContext = createContext({
  trackings: [],
  createTracking: async ({ name }) => {},
  updateTracking: async ({ trackingId, name }) => {},
  track: async ({ trackingId }) => {},
  listTrackings: async ({ page, perPage }) => {},
  findTracking: async (trackingId) => {},
  listOccurrences: async ({ trackingId, page, perPage }) => {},
});

const trackingsApi = async (authCtx) => {
  const validToken = await authCtx.getValidAccessToken()

  if (validToken) {
    return new TrackingsApi(validToken)
  } else {
    return null
  }
}

export default function TrackingsContextProvider({ children }) {
  const [trackings, setTrackings] = useState([]);
  const authCtx = useAuthContext();

  const createTracking = async ({ name }) => {
    const apiClient = await trackingsApi(authCtx)
    if (!apiClient) { return } // auth error: auth context does sign out automatically
    const res = await apiClient.createTracking({ name });
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
    const apiClient = await trackingsApi(authCtx)
    if (!apiClient) { return } // auth error: auth context does sign out automatically
    const res = await apiClient.updateTracking({ trackingId, name });
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
    const apiClient = await trackingsApi(authCtx)
    if (!apiClient) { return } // auth error: auth context does sign out automatically
    const res = await apiClient.track({ trackingId });
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
    const apiClient = await trackingsApi(authCtx)
    if (!apiClient) { return } // auth error: auth context does sign out automatically
    const { status, data } = await apiClient.listTrackings({
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
    const apiClient = await trackingsApi(authCtx)
    if (!apiClient) { return } // auth error: auth context does sign out automatically
    return await apiClient.getTracking({ trackingId });
  };

  const listOccurrences = async ({ trackingId, page, perPage }) => {
    const apiClient = await trackingsApi(authCtx)
    if (!apiClient) { return } // auth error: auth context does sign out automatically
    return await apiClient.occurrences({ trackingId, page, perPage });
  };

  useEffect(() => {
    const load = async () => {
      const { trackings } = await listTrackings({ page: 1, perPage: 10 });

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
