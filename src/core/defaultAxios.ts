import axios from 'axios';
import { asyncLocalStorage } from '../middleware/addCorrelationId';

export const defaultAxios = axios.create();

defaultAxios.interceptors.request.use(
  (config) => {
    const store = asyncLocalStorage.getStore();
    if (store) config.headers['x-correlation-id'] = store;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
