import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/auth', // Thay bằng URL của backend
  withCredentials : true,
  timeout: 10000,                    // Thời gian timeout (10 giây)
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
