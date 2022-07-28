import { Dialog } from '@reach/dialog';
import VisuallyHidden from '@reach/visually-hidden';
import '@reach/dialog/styles.css';

type PropsType = {
  loginLink: string;
  isOpen: boolean;
  close: () => void;
};

export const SnapTradeReact: React.FC<PropsType> = ({
  loginLink,
  isOpen,
  close,
}) => {
  return (
    <div>
      <Dialog
        isOpen={isOpen}
        onDismiss={close}
        aria-labelledby="dialog1Title"
        aria-describedby="dialog1Desc"
        style={{
          padding: '20px 20px',
          width: '500px',
          borderRadius: '1rem',
          background: '#f8fafc',
        }}
      >
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
        >
          <VisuallyHidden>Close</VisuallyHidden> <span aria-hidden>×</span>{' '}
        </button>
        <iframe
          id="snaptrade-react-connection-portal"
          src={loginLink}
          title="SnapTrade Connection Portal - React"
          style={{
            // position: 'relative',
            inset: '0px',
            zIndex: '1000',
            borderWidth: '0px',
            display: 'block',
            overflow: 'hidden auto',
          }}
          height="1000vh"
          width="100%"
          allowFullScreen
          // frameBorder="0"
        ></iframe>
      </Dialog>
    </div>
  );
};
