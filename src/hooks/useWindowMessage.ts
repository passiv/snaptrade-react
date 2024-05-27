import { useEffect, useRef } from 'react';

type Data = {
  status: 'SUCCESS' | 'ERROR';
  authorizationId?: string;
  statusCode?: string;
  detail?: string;
  height?: string;
};

type ErrorData = {
  errorCode?: string;
  statusCode: string;
  detail: string;
};

const getTimeStampInSeconds = () => Math.floor(Date.now() / 1000).toString();

type MessageHandler = {
  handleSuccess?: (data: string) => void;
  handleError?: (data: ErrorData) => void;
  handleExit?: () => void;
  close?: () => void;
};

export const useWindowMessage = ({
  handleSuccess,
  handleError,
  handleExit,
  close,
}: MessageHandler) => {
  const successCallbackRef = useRef(handleSuccess);
  const errorCallbackRef = useRef(handleError);
  const abortCallbackRef = useRef(handleExit);
  const closeCallbackRef = useRef(close);

  useEffect(() => {
    successCallbackRef.current = handleSuccess;
    errorCallbackRef.current = handleError;
    abortCallbackRef.current = handleExit;
    closeCallbackRef.current = close;
  }, [handleSuccess, handleError, handleExit, close]);

  useEffect(() => {
    const cancelled = () => {
      closeCallbackRef.current?.();
      abortCallbackRef.current?.();
    };

    const handleMessageEvent = (e: MessageEvent<unknown>) => {
      const successCallback = successCallbackRef.current;
      const errorCallback = errorCallbackRef.current;
      const abortCallback = abortCallbackRef.current;

      const allowedOrigins = [
        'https://app.snaptrade.com',
        'https://app.staging.snaptrade.com',
        'https://app.local.snaptrade.com',
        'https://connect.snaptrade.com',
        'http://localhost:5173',
      ];

      if (e.data && allowedOrigins.includes(e.origin)) {
        const data = e.data as Data;
        if (data.status === 'SUCCESS' && successCallback) {
          successCallback(data.authorizationId ?? 'SUCCESS');
          localStorage.setItem('timestamp', getTimeStampInSeconds());
        }

        if (data.status === 'ERROR' && errorCallback) {
          const { status, ...rest } = data;
          errorCallback(rest as ErrorData);
          localStorage.setItem('timestamp', getTimeStampInSeconds());
        }

        if (e.data === 'CLOSED' && abortCallback) {
          if (localStorage.getItem('timestamp')) {
            const diffTimeStamp =
              Number(getTimeStampInSeconds()) -
              Number(localStorage.getItem('timestamp'));

            if (diffTimeStamp > 5) {
              abortCallback();
              localStorage.setItem('timestamp', getTimeStampInSeconds());
            }
          } else {
            abortCallback();
            localStorage.setItem('timestamp', getTimeStampInSeconds());
          }
        }

        if (e.data === 'CLOSE_MODAL') {
          cancelled();
        }
      }
    };
    window.addEventListener('message', handleMessageEvent, false);
    return () => {
      window.removeEventListener('message', handleMessageEvent, false);
    };
  }, []);
};
