import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Vercel serves serverless functions from /api
});

export default api;
