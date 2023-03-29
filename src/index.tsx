import { ConfigProvider, Modal } from 'antd';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';

type PropsType = {
  loginLink: string;
  isOpen: boolean;
  close: () => void;
  onSuccess?: (authorizationId: string) => void;
  onError?: (error: string) => void;
  onExit?: () => void;
  contentLabel?: string;
  style?: {
    overlay?: {
      backgroundColor?: string;
      zIndex?: number;
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
  contentLabel = 'Connect Account via SnapTrade',
  style,
}) => {
  const iframeRef = useRef(null);

  const successCallbackRef = useRef<
    ((authorizationId: string) => void) | undefined
  >(onSuccess);
  const errorCallbackRef = useRef<((errorMessage: string) => void) | undefined>(
    onError
  );
  const abortCallbackRef = useRef<VoidFunction | undefined>(onExit);

  useLayoutEffect(() => {
    successCallbackRef.current = onSuccess;
    errorCallbackRef.current = onError;
    abortCallbackRef.current = onExit;
  });

  useEffect(() => {
    const handleMessageEvent = (e: MessageEvent<unknown>) => {
      const successCallback = successCallbackRef.current;
      const errorCallback = errorCallbackRef.current;
      const abortCallback = abortCallbackRef.current;

      if (
        typeof e.data === 'string' &&
        (e.origin === 'https://app.snaptrade.com' ||
          e.origin === 'https://connect.snaptrade.com')
      ) {
        if (e.data.includes('SUCCESS') && successCallback && errorCallback) {
          successCallback(e.data.split(':')[1]);
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

  const cancelled = () => {
    close();
    onExit && onExit();
  };

  const height = isMobile ? '710px' : '600px';

  return (
    <div>
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
          bodyStyle={{
            width: '100%',
          }}
          style={{
            width: '100%',
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
    </div>
  );
};
