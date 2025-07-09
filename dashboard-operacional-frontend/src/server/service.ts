import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.MODE === "production" ? "https://dashboard-operacional-backend-4b392a9c5ff4.herokuapp.com" : "http://localhost:8000",
});