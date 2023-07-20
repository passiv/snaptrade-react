import { ConfigProvider, Modal, Result } from 'antd';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';

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
};

type ErrorData = {
  errorCode?: string;
  statusCode: string;
  detail: string;
};

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
  const [isThirdPartyCookiesBlocked, setIsThirdPartyCookiesBlocked] =
    useState(false);
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

  useEffect(() => {
    const setSessionStorage = (name: string, value: string) => {
      sessionStorage.setItem(name, value);
    };

    const testSessionName = 'sdk_test_session';
    setSessionStorage(testSessionName, 'test');

    const isThirdPartySessionBlocked =
      sessionStorage.getItem(testSessionName) === null;

    console.log('isThirdPartySessionBlocked', isThirdPartySessionBlocked);

    if (isThirdPartySessionBlocked) {
      setIsThirdPartyCookiesBlocked(true);
    }

    // Clean up the test session
    sessionStorage.removeItem(testSessionName);

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
  }, []);

  const cancelled = () => {
    close();
    onExit && onExit();
  };

  const handleCancelButtonClick = () => {
    const iframeElement = document.getElementById(
      'snaptrade-react-connection-portal'
    ) as HTMLIFrameElement | null;
    const iframeWindow = iframeElement?.contentWindow;
    iframeWindow?.postMessage('CANCELLED', '*');
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
          onCancel={handleCancelButtonClick}
          maskClosable={closeOnOverlayClick}
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
          destroyOnClose={true}
        >
          {isThirdPartyCookiesBlocked ? (
            <Result
              status="warning"
              title="Important Information about Your Browser Settings"
              subTitle={
                <div>
                  <div style={{ color: 'black', marginTop: '20px' }}>
                    {' '}
                    <p>
                      The "Block third-party cookies" setting in your browser
                      can impact our app's ability to load properly when
                      embedded within another app. This setting restricts the
                      use of cookies, including essential features that our app
                      relies on.
                    </p>
                    <p>
                      To ensure the best experience, please follow these steps
                      to disable the <strong>Block third-party cookies</strong>{' '}
                      setting:
                    </p>
                  </div>

                  <ul>
                    <li>
                      <strong>Google Chrome:</strong> Go to{' '}
                      <em>
                        Settings {'>'} Privacy and Security {'>'} Cookies and
                        other site data
                      </em>
                      . Disable the "Block third-party cookies" option.
                    </li>
                    <li>
                      <strong>Mozilla Firefox:</strong> Go to{' '}
                      <em>
                        Preferences {'>'} Privacy & Security {'>'} Cookies and
                        Site Data
                      </em>
                      . Uncheck the "Block cookies and site data from third
                      parties" option.
                    </li>
                    <li>
                      <strong>Microsoft Edge:</strong> Go to{' '}
                      <em>
                        Settings {'>'} Privacy, search, and services {'>'}{' '}
                        Cookies and other site data
                      </em>
                      . Turn off the "Block third-party cookies" setting.
                    </li>
                    <li>
                      <strong>Safari:</strong> Go to{' '}
                      <em>
                        Preferences {'>'} Privacy {'>'} Cookies and website data
                      </em>
                      . Uncheck the "Block all cookies" option.
                    </li>
                  </ul>

                  <div style={{ color: 'black', marginTop: '20px' }}>
                    <p>
                      If you have any questions or need assistance, please reach
                      out to our support team at{' '}
                      <a href="mailto:support@snaptrade.com">
                        support@example.com
                      </a>{' '}
                      .
                    </p>
                  </div>
                </div>
              }
            />
          ) : (
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
          )}
        </Modal>
      </ConfigProvider>
    </div>
  );
};
