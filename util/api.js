import axios from "axios";
const BASE_API_URL =
  "https://bkk0p8ol4k.execute-api.us-east-1.amazonaws.com/api/v1";

const makeRequest = ({ path, data = {}, token, method }) => {
  if (method === "get") {
    return makeGetRequest({ path, data, token });
  } else {
    return axios[method](`${BASE_API_URL}/${path}`, data, {
      headers: {
        Authorization: token,
      },
      validateStatus: () => true,
    });
  }
};

const makeGetRequest = ({ path, data = {}, token }) => {
  return axios.get(`${BASE_API_URL}/${path}`, {
    params: data,
    headers: {
      Authorization: token,
    },
    validateStatus: () => true,
  });
};

export const createTracking = async (token, { name }) => {
  return await makeRequest({
    method: "post",
    path: "trackings",
    data: { name },
    token,
  });
};

export const getTracking = async (token, { trackingId }) => {
  return await makeRequest({
    method: "get",
    path: `trackings/${trackingId}`,
    token,
  });
};

export const listTrackings = async (token, { page = 1, perPage = 10 }) => {
  return await makeRequest({
    method: "get",
    path: "trackings",
    data: { page, perPage },
    token,
  });
};

export const occurrences = async (token, { trackingId, page = 1, perPage = 10 }) => {
  return await makeRequest({
    method: "get",
    path: `trackings/${trackingId}/occurrences`,
    data: { page, perPage },
    token,
  });
};

export const track = async (token, { trackingId }) => {
  return await makeRequest({
    method: "post",
    path: `trackings/${trackingId}/track`,
    token,
  });
};

export const updateTrack = async (token, { trackingId, name }) => {
  return await makeRequest({
    method: "put",
    path: `trackings/${trackingId}`,
    data: { name },
    token,
  });
};
