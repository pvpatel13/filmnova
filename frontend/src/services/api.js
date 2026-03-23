import axios from 'axios';

// Get the API URL from environment variables, fallback to localhost if not found
// In Render/Vercel, make sure REACT_APP_API_URL is set to your backend URL (e.g. https://filmnova.onrender.com)
const API_URL = process.env.REACT_APP_API_URL || 'https://filmnova.onrender.com';
const BACKEND_URL = API_URL.endsWith('/') ? `${API_URL}api/` : `${API_URL}/api/`;

const backendApi = axios.create({
  baseURL: BACKEND_URL,
});

// Set token in headers for backend requests
backendApi.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

const omdbApi = {
  get: (url, config) => backendApi.get(`movies/${url}`, config),
  getNowPlaying: () => backendApi.get('movies/now_playing'),
  getPopular: () => backendApi.get('movies/popular'),
  getTopRated: () => backendApi.get('movies/top_rated'),
  getGenres: () => backendApi.get('movies/genres'),
  getMoviesByGenre: (genreId) => backendApi.get('movies/discover', { params: { genreId } }),
  getSimilarMovies: (id) => backendApi.get(`movies/similar/${id}`),
};

export { omdbApi, backendApi };
