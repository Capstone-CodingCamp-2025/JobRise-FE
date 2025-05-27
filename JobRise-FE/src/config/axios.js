import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:3888/api",
});

// export const API_IMAGE = "http://localhost:3888";
