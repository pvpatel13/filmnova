import axios from 'axios';

const BACKEND_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/`;

const omdbApi = {
  get: (url, config) => {
    // Keep backward compatibility for existing calls
    return axios.get(`${BACKEND_URL}movies/${url}`, config);
  },
  getNowPlaying: () => axios.get(`${BACKEND_URL}movies/now_playing`),
  getPopular: () => axios.get(`${BACKEND_URL}movies/popular`),
  getTopRated: () => axios.get(`${BACKEND_URL}movies/top_rated`),
  getGenres: () => axios.get(`${BACKEND_URL}movies/genres`),
  getMoviesByGenre: (genreId) => axios.get(`${BACKEND_URL}movies/discover`, { params: { genreId } }),
  getSimilarMovies: (id) => axios.get(`${BACKEND_URL}movies/similar/${id}`),
};

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

export { omdbApi, backendApi };
