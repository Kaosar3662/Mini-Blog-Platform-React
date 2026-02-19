/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';

interface ToasterProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
}

const Toaster: React.FC<ToasterProps> = ({ message, type = 'info' }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    if (message) {
      setMounted(true);

      requestAnimationFrame(() => {
        setVisible(true);
      });

      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      const unmountTimer = setTimeout(() => {
        setMounted(false);
      }, 3500);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [message]);

  if (!mounted) return null;

  let typeStyles = '';
  switch (type) {
    case 'success':
      typeStyles = 'text-green-800 rounded-lg bg-green-100';
      break;
    case 'error':
      typeStyles = 'text-red-600 rounded-lg bg-red-100';
      break;
    case 'info':
    default:
      typeStyles = 'text-blue-600 rounded-lg bg-blue-50';
      break;
  }

  return (
    <div
      className={`border ${typeStyles} px-8 py-2 rounded fixed top-5 left-1/2 -translate-x-1/2 max-w-xs z-50 text-center transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
      }`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default Toaster;
