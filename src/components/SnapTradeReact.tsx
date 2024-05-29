import React from 'react';
import { Modal } from 'antd';
import { useRef } from 'react';
import { useWindowMessage } from '../hooks/useWindowMessage';

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

type ErrorData = {
  errorCode?: string;
  statusCode: string;
  detail: string;
};

declare const process: {
  env: {
    REACT_APP_VERSION: string;
  };
};

const VERSION = process.env.REACT_APP_VERSION;

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

  useWindowMessage({
    handleSuccess: onSuccess,
    handleError: onError,
    handleExit: onExit,
    close: close,
  });

  const loginLinkURL = loginLink ? new URL(loginLink) : null;
  loginLinkURL?.searchParams.append('reactSDK', VERSION);
  const modifiedLoginLink = loginLinkURL?.toString();

  return (
    <div>
      <Modal
        open={isOpen}
        closable={false}
        centered
        footer={null}
        maskStyle={{
          backgroundColor:
            style?.overlay?.backgroundColor ?? 'rgba(255, 255, 255, 0.75)',
        }}
        zIndex={style?.overlay?.zIndex}
        destroyOnClose={true}
        width={450}
        bodyStyle={{
          height: '600px',
          overflow: 'scroll',
          position: 'relative',
          overflowX: 'hidden',
          overflowY: 'auto',
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
