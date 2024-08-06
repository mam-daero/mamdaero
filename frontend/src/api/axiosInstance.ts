import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://mamdaero.o-r.kr/api/',
  headers: { 'Content-Type': 'application/json' },
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

axiosInstance.interceptors.request.use();

axiosInstance.interceptors.response.use();

export default axiosInstance;
