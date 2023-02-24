import { ConfigProvider, Modal } from 'antd';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { LegacySupport } from './legacySupport';

type PropsType = {
  loginLink: string;
  isOpen: boolean;
  close: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onExit?: () => void;
  closeBtn?: boolean;
  contentLabel?: string;
  style?: {
    overlay?: {
      backgroundColor?: string;
      width?: string;
      height?: string;
      zIndex?: number;
    };
    content?: {
      backgroundColor?: string;
      margin?: string;
      width?: string;
      height?: string;
      padding?: string;
      borderRadius?: string;
      border?: string;
    };
  };
};

const getTimeStampInSeconds = () => Math.floor(Date.now() / 1000).toString();

export const SnapTradeReact: React.FC<PropsType> = ({
  loginLink,
  isOpen,
  close,
  onSuccess,
  onError,
  onExit,
  closeBtn = true,
  contentLabel = 'Connect Account via SnapTrade',
  style,
}) => {
  const iframeRef = useRef(null);

  const successCallbackRef = useRef<VoidFunction | undefined>(onSuccess);
  const errorCallbackRef = useRef<((errorMessage: string) => void) | undefined>(
    onError
  );
  const abortCallbackRef = useRef<VoidFunction | undefined>(onExit);

  useLayoutEffect(() => {
    successCallbackRef.current = onSuccess;
    errorCallbackRef.current = onError;
    abortCallbackRef.current = onExit;
  });

  // check to see if the login link is for the new app or the legacy app (to be removed after launching the new app)
  const isNewApp =
    loginLink?.split('.')[1]?.toLowerCase() === 'snaptrade' ||
    loginLink?.split('.')[2]?.toLowerCase() === 'snaptrade';

  useEffect(() => {
    const handleMessageEvent = (e: MessageEvent<unknown>) => {
      const successCallback = successCallbackRef.current;
      const errorCallback = errorCallbackRef.current;
      const abortCallback = abortCallbackRef.current;

      if (
        typeof e.data === 'string' &&
        (e.origin === 'https://app.passiv.com' ||
          e.origin === 'https://app.snaptrade.com' ||
          e.origin === 'https://connect.snaptrade.com')
      ) {
        if (e.data === 'SUCCESS' && successCallback && errorCallback) {
          successCallback();
          localStorage.setItem('timestamp', getTimeStampInSeconds());
        }

        if (e.data.includes('ERROR') && errorCallback) {
          errorCallback(e.data.split(':')[1]);
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
      }
    };
    window.addEventListener('message', handleMessageEvent, false);
    return () => {
      window.removeEventListener('message', handleMessageEvent, false);
    };
  }, []);

  const cancelled = () => {
    close();
    onExit && onExit();
  };

  const height = isMobile ? '710px' : '600px';

  return (
    <div>
      {isNewApp ? (
        <ConfigProvider
          theme={{
            token: {
              paddingContentHorizontalLG: 0,
              padding: 10,
            },
          }}
        >
          <Modal
            open={isOpen}
            closable={true}
            centered
            footer={null}
            onCancel={cancelled}
            maskStyle={{
              backgroundColor:
                style?.overlay?.backgroundColor ?? 'rgba(255, 255, 255, 0.75)',
            }}
            zIndex={style?.overlay?.zIndex}
          >
            <iframe
              id="snaptrade-react-connection-portal"
              src={loginLink}
              ref={iframeRef}
              title={contentLabel}
              style={{
                inset: '0px',
                zIndex: '1000',
                borderWidth: '0px',
                display: 'block',
                overflow: 'auto',
                height,
                width: '100%',
              }}
              allowFullScreen
            ></iframe>
          </Modal>
        </ConfigProvider>
      ) : (
        <LegacySupport
          {...{
            loginLink,
            isOpen,
            close,
            closeBtn,
            contentLabel,
            style,
          }}
        />
      )}
    </div>
  );
};
