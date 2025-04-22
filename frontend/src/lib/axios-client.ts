import { useStore } from '@/store/store';
import { CustomError } from '@/types/custom-error.type';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

console.log(baseURL);

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

API.interceptors.request.use(
  (config) => {
    const accessToken = useStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data } = error.response;
    // const { data, status } = error.response;

    // if (data?.errorCode === 'ACCESS_UNAUTHORIZED') {
    //   window.location.href = '/';
    //   return;
    // }

    // if (data === 'Unauthorized' && status === 401) {
    //   window.location.href = '/';
    // }

    const customeError: CustomError = {
      ...error,
      errorCode: data?.errorCode || 'UNKNOWN_ERROR',
    };

    return Promise.reject(customeError);
  }
);

export default API;

