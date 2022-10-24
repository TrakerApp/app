import axios from "axios";
const BASE_API_URL = `${process.env.API_URL}/api/v1`;

export default class TrackingsApi {
  constructor(token) {
    this.token = token;
  }

  makeRequest({ path, data = {}, method }) {
    if (method === "get") {
      return this.makeGetRequest({ path, data });
    } else {
      return axios[method](`${BASE_API_URL}/${path}`, data, {
        headers: {
          Authorization: this.token,
        },
        validateStatus: () => true,
      });
    }
  }

  makeGetRequest({ path, data = {} }) {
    return axios.get(`${BASE_API_URL}/${path}`, {
      params: data,
      headers: {
        Authorization: this.token,
      },
      validateStatus: () => true,
    });
  }

  async getTracking({ trackingId }) {
    return await this.makeRequest({
      method: "get",
      path: `trackings/${trackingId}`,
    });
  }

  async createTracking({ name }) {
    return await this.makeRequest({
      method: "post",
      path: "trackings",
      data: { name },
    });
  }

  async listTrackings({ page = 1, perPage = 10 }) {
    return await this.makeRequest({
      method: "get",
      path: "trackings",
      data: { page, perPage },
    });
  }

  async occurrences({ trackingId, page = 1, perPage = 10 }) {
    return await this.makeRequest({
      method: "get",
      path: `trackings/${trackingId}/occurrences`,
      data: { page, perPage },
    });
  }

  async removeOccurrence({ trackingId, occurrenceId }) {
    return await this.makeRequest({
      method: "delete",
      path: `trackings/${trackingId}/occurrences/${occurrenceId}`
    });
  }

  async track({ trackingId }) {
    return await this.makeRequest({
      method: "post",
      path: `trackings/${trackingId}/track`,
    });
  }

  async deleteTracking({ trackingId }) {
    return await this.makeRequest({
      method: "delete",
      path: `trackings/${trackingId}`
    });
  }

  async updateTracking({ trackingId, name }) {
    return await this.makeRequest({
      method: "put",
      path: `trackings/${trackingId}`,
      data: { name },
    });
  }
}
