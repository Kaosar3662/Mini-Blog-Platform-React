import axios, { AxiosRequestConfig, Method } from 'axios';

interface AuthStorage {
  token?: string;
}

const getAuthToken = (): string | null => {
  const auth = localStorage.getItem('auth');
  if (!auth) return null;
  const LS: AuthStorage = JSON.parse(auth);
  return LS.token || null;
};

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  config.headers = (config.headers ?? {}) as any;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

interface RequestConfig extends AxiosRequestConfig {}

const apiService = {
  request: async <T = any,>(
    method: Method,
    endpoint: string,
    data: any = null,
    config: RequestConfig = {},
  ): Promise<T | null> => {
    try {
      const response = await api({
        method,
        url: endpoint,
        ...(method.toLowerCase() === 'get' ? { params: data } : { data }),
        ...config,
      });

      return response.data as T;
    } catch (e: any) {
      if (e.response?.data?.message) {
        console.error(e.response.data.message);
      }
      return null;
    }
  },
};

export default apiService;
