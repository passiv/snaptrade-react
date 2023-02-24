import ReactModal from 'react-modal';
import { isMobile } from 'react-device-detect';
import { useRef } from 'react';

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

export const LegacySupport: React.FC<PropsType> = ({
  loginLink,
  isOpen,
  close,
  closeBtn,
  contentLabel,
  style,
}) => {
  const iframeRef = useRef(null);
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={close}
      aria-labelledby="dialog1Title"
      aria-describedby="dialog1Desc"
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor:
            style?.overlay?.backgroundColor ?? 'rgba(255, 255, 255, 0.75)',
          width: style?.overlay?.width ?? '100%',
          height: isMobile ? '100%' : style?.overlay?.height ?? 'auto',
          zIndex: style?.overlay?.zIndex ?? 1,
        },
        content: {
          backgroundColor: style?.content?.backgroundColor ?? '#f8fafc',
          margin: style?.content?.margin ?? '0 auto',
          borderRadius: style?.content?.borderRadius ?? '1rem',
          border:
            style?.content?.border ?? '1px solid rgba(255, 255, 255, 0.75)',
          textAlign: 'center',
          overflow: 'auto',
          inset: isMobile ? 'unset' : '40px',
          padding: isMobile ? '0px' : style?.content?.padding ?? '20px 20px',
          width: isMobile ? '100%' : style?.content?.width ?? '500px',
          height: isMobile ? '100%' : style?.content?.height ?? 'auto',
        },
      }}
      contentLabel={contentLabel}
    >
      {closeBtn && (
        <button
          className="close-button"
          onClick={close}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '30px',
            float: isMobile ? 'left' : 'right',
            cursor: 'pointer',
            marginBottom: '20px',
            position: 'sticky',
            margin: '20px 10px',
          }}
          data-testid="closeBtn"
        >
          <span aria-hidden>×</span>
        </button>
      )}

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
          height: '100%',
        }}
        height="1000vh"
        width="100%"
        allowFullScreen
      ></iframe>
    </ReactModal>
  );
};
