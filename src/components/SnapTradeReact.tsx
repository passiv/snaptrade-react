import React from 'react';
import { Modal } from 'antd';
import { useRef } from 'react';
import { useWindowMessage } from '../hooks/useWindowMessage';
import { ErrorData } from '../types/ErrorData';

type PropsType = {
  loginLink: string;
  isOpen: boolean;
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

const VERSION = '3.2.5';

const SnapTradeReact: React.FC<PropsType> = ({
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

  useWindowMessage({
    handleSuccess: onSuccess,
    handleError: onError,
    handleExit: onExit,
    close: close,
  });

  const url = loginLink ? new URL(loginLink) : null;
  const searchParams = url?.searchParams;
  const isDarkMode =
    searchParams?.has('darkMode') && searchParams.get('darkMode') === 'true';

  url?.searchParams.append('reactSDK', VERSION);
  const modifiedLoginLink = url?.toString();

  return (
    <div>
      <Modal
        open={isOpen}
        closable={false}
        centered
        footer={null}
        zIndex={style?.overlay?.zIndex}
        destroyOnHidden={true}
        width={450}
        styles={{
          mask: {
            backgroundColor:
              style?.overlay?.backgroundColor ??
              (isDarkMode
                ? 'rgba(0, 0, 0, 0.75)'
                : 'rgba(255, 255, 255, 0.75)'),
          },
          body: {
            height: '600px',
            overflow: 'scroll',
            position: 'relative',
            overflowX: 'hidden',
            overflowY: 'auto',
          },
          content: isDarkMode
            ? {
                backgroundColor: '#0a0a0a',
              }
            : undefined,
        }}
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
            minHeight: '600px',
          }}
          allowFullScreen
        ></iframe>
      </Modal>
    </div>
  );
};
export default SnapTradeReact;
