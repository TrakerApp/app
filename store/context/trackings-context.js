import { createContext, useState, useEffect } from "react";
import TrackingsApi from "../../util/trackingsApi";
import { useAuthContext } from "./auth-context";

const TRACKINGS_PER_PAGE = 15;

const sortTrackings = (trackings) => {
  return trackings.sort((a, b) => {
    // sort by lastOccurrenceAt
    if (
      !a.lastOccurrenceAt ||
      !b.lastOccurrenceAt ||
      a.lastOccurrenceAt === b.lastOccurrenceAt
    ) {
      return 0;
    }
    const aDate = new Date(a.lastOccurrenceAt);
    const bDate = new Date(b.lastOccurrenceAt);
    if (aDate > bDate) {
      return -1;
    }
    if (aDate < bDate) {
      return 1;
    }
  });
};

export const TrackingsContext = createContext({
  trackings: [],
  refreshing: false,
  createTracking: async ({ name }) => {},
  updateTracking: async ({ trackingId, name }) => {},
  track: async ({ trackingId }) => {},
  listTrackings: async ({ page, perPage }) => {},
  findTracking: async (trackingId) => {},
  listOccurrences: async ({ trackingId, page, perPage }) => {},
  loadMoreTrackings: async () => {},
  refreshTrackings: async () => {},
  removeOccurrence: async ({ trackingId, occurrenceId }) => {},
  removeTracking: async ({ trackingId }) => {},
});

const trackingsApi = async (authCtx) => {
  const validToken = await authCtx.getValidIdToken();

  if (validToken) {
    return new TrackingsApi(validToken);
  } else {
    return null;
  }
};

export default function TrackingsContextProvider({ children }) {
  const [trackings, setTrackings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false); // used for fetching more AND for refreshing
  const [hasMore, setHasMore] = useState(true);
  const authCtx = useAuthContext();

  const createTracking = async ({ name }) => {
    const apiClient = await trackingsApi(authCtx);
    if (!apiClient) {
      return;
    } // auth error: auth context does sign out automatically
    const res = await apiClient.createTracking({ name });
    const { status, data } = res;

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
    const apiClient = await trackingsApi(authCtx);
    if (!apiClient) {
      return;
    } // auth error: auth context does sign out automatically
    const res = await apiClient.updateTracking({ trackingId, name });
    const { status, data } = res;

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
    const apiClient = await trackingsApi(authCtx);
    if (!apiClient) {
      return;
    } // auth error: auth context does sign out automatically
    const res = await apiClient.track({ trackingId });
    const { status, data } = res;

    if (status === 201) {
      setTrackings((trackings) => {
        const tracking = trackings.find((t) => t.trackingId === trackingId);
        tracking.lastOccurrenceAt = data.createdAt;
        return [...sortTrackings(trackings)];
      });
    }

    return res;
  };

  const listTrackings = async ({ page = 1, perPage = TRACKINGS_PER_PAGE }) => {
    const apiClient = await trackingsApi(authCtx);
    if (!apiClient) {
      return;
    } // auth error: auth context does sign out automatically
    const { status, data } = await apiClient.listTrackings({
      page,
      perPage,
    });
    if (status >= 300) {
      // error happened
      console.log("ERROR on listtrackings:", status);
    } else {
      // control unnecesarry re-fetching
      if (data.page >= data.totalPages) {
        setHasMore(false);
      }
    }
    return data;
  };

  const findTracking = async (trackingId) => {
    const apiClient = await trackingsApi(authCtx);
    if (!apiClient) {
      return;
    } // auth error: auth context does sign out automatically
    return await apiClient.getTracking({ trackingId });
  };

  const removeTracking = async ({ trackingId }) => {
    const apiClient = await trackingsApi(authCtx);
    if (!apiClient) {
      return;
    } // auth error: auth context does sign out automatically
    const res = await apiClient.removeTracking({ trackingId });
    const { status, data } = res;

    if (status === 204) {
      setTrackings((trackings) => {
        const index = trackings.findIndex((t) => t.trackingId === trackingId);
        trackings.splice(index, 1);
        return [...trackings];
      });
    }

    return res;
  };

  const removeOccurrence = async ({ trackingId, occurrence }) => {
    const apiClient = await trackingsApi(authCtx);
    if (!apiClient) {
      return;
    } // auth error: auth context does sign out automatically
    const res = await apiClient.removeOccurrence({
      trackingId,
      occurrenceId: occurrence.occurrenceId,
    });
    const currentLastOccurrenceAt = trackings.find(
      (t) => t.trackingId === trackingId
    ).lastOccurrenceAt;

    if (res.status === 204) {
      // check if occurrence.createdAt is the same as tracking.lastOccurrenceAt, and if it is, we need the new lastOccurrenceAt (previous or never)
      if (occurrence.createdAt === currentLastOccurrenceAt) {
        const { status, data } = await listOccurrences({
          trackingId,
          page: 1,
          perPage: 1,
        });

        if (status === 200) {
          setTrackings((trackings) => {
            const tracking = trackings.find((t) => t.trackingId === trackingId);
            tracking.lastOccurrenceAt = data.occurrences[0]?.createdAt || null;
            return [...sortTrackings(trackings)];
          });
        }
      }
    }

    return res;
  };

  const listOccurrences = async ({ trackingId, page, perPage }) => {
    const apiClient = await trackingsApi(authCtx);
    if (!apiClient) {
      return;
    } // auth error: auth context does sign out automatically
    return await apiClient.occurrences({ trackingId, page, perPage });
  };

  const refreshTrackings = async () => {
    setRefreshing(true);
    setHasMore(true);
    setCurrentPage(1);
    const data = await listTrackings({ page: 1, perPage: TRACKINGS_PER_PAGE });
    setTrackings(data.trackings);
    setRefreshing(false);
  };

  const loadMoreTrackings = async () => {
    if (refreshing) {
      return;
    }
    if (!hasMore) {
      return;
    }
    setRefreshing(true);

    const newPage = currentPage + 1;
    const data = await listTrackings({
      page: newPage,
      perPage: TRACKINGS_PER_PAGE,
    });
    const existingTrackings = trackings.map((t) => t.trackingId);
    // we need to exclude any new tracking that is already on the list, because it was created recently
    const newTrackings = data.trackings.filter(
      (t) => !existingTrackings.includes(t.trackingId)
    );
    setTrackings((trackings) => [...trackings, ...newTrackings]);
    setCurrentPage(newPage);
    setRefreshing(false);
  };

  useEffect(() => {
    const load = async () => {
      setRefreshing(true);
      const { trackings } = await listTrackings({
        page: currentPage,
        perPage: TRACKINGS_PER_PAGE,
      });

      setTrackings(trackings);
      setRefreshing(false);
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
    loadMoreTrackings,
    refreshing,
    refreshTrackings,
    removeOccurrence,
    removeTracking,
  };

  return (
    <TrackingsContext.Provider value={value}>
      {children}
    </TrackingsContext.Provider>
  );
}
