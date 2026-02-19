import React, { createContext, useContext, useState } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Spinner from 'src/views/spinner/Spinner';
import Toaster from 'src/components/alerts/Toaster';

type UIContextType = {
  loader: boolean;
  setLoader: (value: boolean) => void;
  alert: { message: string; type: 'success' | 'error' } | null;
  setAlert: (value: { message: string; type: 'success' | 'error' } | null) => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

export const ErrorAndLoader: React.FC = () => {
  const { loader, alert } = useUI();

  return (
    <>
      {loader && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
          <Spinner />
        </div>
      )}
      {alert && <Toaster message={alert.message} type={alert.type} />}
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
    setAlert?: (value: { message: string; type: 'success' | 'error' } | null) => void,
    setErrors?: (errors: Record<string, string>) => void,
  ): Promise<T | { errors?: any; success?: boolean; data?: any }> => {
    if (setLoader) setLoader(true);
    try {
      const response = await axiosInstance.request<T>({
        method,
        url,
        data,
        ...config,
      });
      const res: any = response.data;

      if (setLoader) setLoader(false);

      // handle form field errors
      if (setErrors && res.errors) {
        setErrors(res.errors);
      }

      // Success alerts and normal error
      if (setAlert && res?.message && (!res.errors || Object.keys(res.errors).length === 0)) {
        if (res.success === !true) {
          setAlert({ message: res.message, type: 'error' });
        }
      }

      return response.data;
    } catch (error: any) {
      if (setLoader) setLoader(false);
      if (error.response) {
        const res = error.response.data;

        // Validation errors
        if (setErrors && res.errors) {
          setErrors(res.errors);
        }

        // Error alerts
        if (setAlert && res?.message) {
          setAlert({
            message: res.message,
            type: 'error',
          });
        }

        return res;
      } else {
        if (setAlert) {
          setAlert({
            message: 'Network error. Please try again later.',
            type: 'error',
          });
        }
        return { success: false, errors: { general: 'Network error' } };
      }
    }
  },
};
