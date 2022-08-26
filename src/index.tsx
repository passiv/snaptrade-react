import ReactModal from 'react-modal';

type PropsType = {
  loginLink: string;
  isOpen: boolean;
  closeBtn?: boolean;
  close: () => void;
  contentLabel?: string;
  style?: {
    overlay?: {
      backgroundColor?: string;
      width?: string;
    };
    content?: {
      backgroundColor?: string;
      margin?: string;
      width?: string;
      padding?: string;
      borderRadius?: string;
      border?: string;
    };
  };
};

export const SnapTradeReact: React.FC<PropsType> = ({
  loginLink,
  isOpen,
  closeBtn = true,
  close,
  contentLabel = 'SnapTrade Connection Portal rendering in an iframe',
  style,
}) => {
  return (
    <div>
      <ReactModal
        isOpen={isOpen}
        aria-labelledby="dialog1Title"
        aria-describedby="dialog1Desc"
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor:
              style?.overlay?.backgroundColor ?? 'rgba(255, 255, 255, 0.75)',
            width: style?.overlay?.width ?? '100%',
          },
          content: {
            backgroundColor: style?.content?.backgroundColor ?? '#f8fafc',
            margin: style?.content?.margin ?? '0 auto',
            width: style?.content?.width ?? '500px',
            padding: style?.content?.padding ?? '20px 20px',
            borderRadius: style?.content?.borderRadius ?? '1rem',
            border:
              style?.content?.border ?? '1px solid rgba(255, 255, 255, 0.75)',
            textAlign: 'center',
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
              float: 'right',
              cursor: 'pointer',
              marginBottom: '20px',
            }}
            data-testid="closeBtn"
          >
            <span aria-hidden>×</span>
          </button>
        )}

        <iframe
          id="snaptrade-react-connection-portal"
          src={loginLink}
          title="SnapTrade Connection Portal - React"
          style={{
            inset: '0px',
            zIndex: '1000',
            borderWidth: '0px',
            display: 'block',
            overflow: 'hidden auto',
          }}
          height="1000vh"
          width="100%"
          allowFullScreen
        ></iframe>
      </ReactModal>
    </div>
  );
};
