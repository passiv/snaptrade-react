import { SnapTradeReact } from '../index';
import { render, screen, cleanup } from '@testing-library/react';

afterEach(cleanup);
const props = {
  loginLink: 'https://app.passiv.com/snaptrade',
  isOpen: true,
  close: () => console.log('hi'),
};

test('renders modal based on passed in props', () => {
  render(<SnapTradeReact {...props} />, {});

  expect(screen.getByRole('dialog'));
  expect(
    screen.getByLabelText('SnapTrade Connection Portal rendering in an iframe')
  );

  expect(
    screen.getByTitle(/snapTrade connection portal - react/i)
  ).toHaveProperty('id', 'snaptrade-react-connection-portal');

  expect(
    screen.getByTitle(/snapTrade connection portal - react/i)
  ).toHaveProperty('src', props.loginLink);

  expect(screen.getByTestId(/closeBtn/i)).toBeTruthy();
});
