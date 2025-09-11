// apiClient.js
import axios from 'axios';
import { auth } from './firebase'; // assuming you initialized Firebase here

const API = axios.create({
  baseURL: 'http://localhost:4000',
});

API.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken();
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${idToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
