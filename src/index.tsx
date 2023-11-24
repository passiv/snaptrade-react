import { Modal } from 'antd';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { SnapTradeV2Support } from './SnapTradeV2Support';
import packageJson from '../package.json';

type PropsType = {
  loginLink: string;
  isOpen: boolean;
  closeOnOverlayClick?: boolean;
  close: () => void;
  onSuccess?: (data: string) => void;
  onError?: (data: ErrorData) => void;
  onExit?: () => void;
  contentLabel?: string;
  style?: {
    overlay?: {
      backgroundColor?: string;
      zIndex?: number;
    };
  };
};

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

const REACT_SDK_VERSION = packageJson.version;
const getTimeStampInSeconds = () => Math.floor(Date.now() / 1000).toString();

export const SnapTradeReact: React.FC<PropsType> = ({
  loginLink,
  isOpen,
  closeOnOverlayClick = true,
  close,
  onSuccess,
  onError,
  onExit,
  contentLabel = 'Connect Account via SnapTrade',
  style,
}) => {
  const iframeRef = useRef(null);

  const successCallbackRef = useRef<((data: string) => void) | undefined>(
    onSuccess
  );
  const errorCallbackRef = useRef<((data: ErrorData) => void) | undefined>(
    onError
  );
  const abortCallbackRef = useRef<VoidFunction | undefined>(onExit);

  useLayoutEffect(() => {
    successCallbackRef.current = onSuccess;
    errorCallbackRef.current = onError;
    abortCallbackRef.current = onExit;
  });

  const loginLinkURL = loginLink ? new URL(loginLink) : null;

  loginLinkURL?.searchParams.append('reactSDK', REACT_SDK_VERSION);

  const isV3 =
    loginLinkURL?.searchParams.get('connectionPortalVersion') === 'v3'
      ? true
      : false;

  const modifiedLoginLink = loginLinkURL?.toString();

  useEffect(() => {
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

      const iframe = document.getElementById(
        'snaptrade-react-connection-portal'
      );
      if (e.data && allowedOrigins.includes(e.origin)) {
        const data = e.data as Data;
        if (iframe) {
          iframe.style.height = `${data.height}px`;
        }
        if (data.status === 'SUCCESS' && successCallback && errorCallback) {
          data.authorizationId
            ? successCallback(data.authorizationId)
            : successCallback('SUCCESS');
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
  }, [isOpen]);

  const cancelled = () => {
    close();
    onExit && onExit();
  };

  return (
    <div>
      {isV3 ? (
        <Modal
          open={isOpen}
          closable={false}
          centered
          footer={null}
          maskClosable={closeOnOverlayClick}
          maskStyle={{
            backgroundColor:
              style?.overlay?.backgroundColor ?? 'rgba(255, 255, 255, 0.75)',
          }}
          zIndex={style?.overlay?.zIndex}
          destroyOnClose={true}
          width={450}
        >
          <iframe
            id="snaptrade-react-connection-portal"
            src={modifiedLoginLink}
            ref={iframeRef}
            title={contentLabel}
            style={{
              inset: '0px',
              zIndex: '1000',
              borderWidth: '0px',
              display: 'block',
              overflow: 'none',
              width: '100%',
              minHeight: '300px',
            }}
            allowFullScreen
          ></iframe>
        </Modal>
      ) : (
        <SnapTradeV2Support
          {...{
            loginLink: modifiedLoginLink ?? loginLink,
            isOpen,
            close,
            contentLabel,
            style,
          }}
        />
      )}
    </div>
  );
};
