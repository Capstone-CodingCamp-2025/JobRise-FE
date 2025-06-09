import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://jobrise.hotelmarisrangkas.com/api",
});

// export const API_IMAGE = "http://localhost:3888";
