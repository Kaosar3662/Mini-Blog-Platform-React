import React, { createContext, useContext, useState } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Spinner from 'src/views/spinner/Spinner';
import { Alert } from 'flowbite-react';

type UIContextType = {
  loader: boolean;
  setLoader: (value: boolean) => void;
  alert: string | null;
  setAlert: (message: string | null) => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);

  return (
    <UIContext.Provider value={{ loader, setLoader, alert, setAlert }}>
      {children}
      <ErrorAndLoader />
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

type ErrorAndLoaderProps = {
  alertType?: 'success' | 'error';
};

export const ErrorAndLoader: React.FC<ErrorAndLoaderProps> = ({ alertType }) => {
  const { loader, alert, setAlert } = useUI();

  return (
    <>
      {loader && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
          <Spinner />
        </div>
      )}
      {alert && (
        <div className="fixed top-5 right-5 z-50 cursor-pointer" onClick={() => setAlert(null)}>
          <Alert className="rounded-lg --color-primary text-black">{alert}</Alert>
        </div>
      )}
    </>
  );
};

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
const getAuthToken = () => {
  const auth = localStorage.getItem('auth');
  if (!auth) return null;
  const LS = JSON.parse(auth);
  return LS.token || null;
};

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

export const apiService = {
  request: async <T = any,>(
    method: AxiosRequestConfig['method'],
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    setLoader?: (value: boolean) => void,
    setAlert?: (message: string | null) => void,
  ): Promise<T | { errors?: any; success?: boolean; data?: any }> => {
    if (setLoader) setLoader(true);
    try {
      const response = await axiosInstance.request<T>({
        method,
        url,
        data,
        ...config,
      });
      if (setLoader) setLoader(false);
      return response.data;
    } catch (error: any) {
      if (setLoader) setLoader(false);
      if (error.response) {
        return error.response.data;
      } else {
        if (setAlert) setAlert('Network error. Please try again later.');
        return { success: false, errors: { general: 'Network error' } };
      }
    }
  },
};
