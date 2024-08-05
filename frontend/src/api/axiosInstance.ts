import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://mamdaero.o-r.kr/api/',
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use();

axiosInstance.interceptors.response.use();

export default axiosInstance;
