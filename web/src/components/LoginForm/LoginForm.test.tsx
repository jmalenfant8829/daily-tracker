// TODO add validation

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { AUTH_TOKEN, CURRENT_USER } from '../../constants';
import { testToken } from '../../mocks/handlers';
import { setLogger } from 'react-query';

// mute console error from react-query calls
beforeEach(() => {
  setLogger({
    log: () => {},
    warn: () => {},
    error: () => {}
  });
});

//test('login form should reject blank username submission')n

test('redirects to home page upon successful login', async () => {
  render(<App />);
  userEvent.click(screen.getByRole('button', { name: /log in/i }));

  userEvent.type(await screen.findByLabelText(/username/i), 'gordin');
  userEvent.type(screen.getByLabelText(/password/i), 'but-maars');
  userEvent.click(screen.getByTestId('login-form-submit-button'));

  const homePageHeader = await screen.findByRole('heading', {
    name: /weekly time tracking/i
  });

  expect(homePageHeader).toBeInTheDocument();
});

test('reports error message upon failing to log in', async () => {
  render(<App />);
  userEvent.click(screen.getByRole('button', { name: /log in/i }));

  userEvent.type(await screen.findByLabelText(/username/i), 'gordin');
  userEvent.type(screen.getByLabelText(/password/i), 'wrong-password');
  userEvent.click(screen.getByTestId('login-form-submit-button'));

  const error = await screen.findByText(/invalid login or password./i);
  expect(error).toBeInTheDocument();
});

test('sets user and auth token in localstorage on login', async () => {
  render(<App />);
  userEvent.click(screen.getByRole('button', { name: /log in/i }));

  userEvent.type(await screen.findByLabelText(/username/i), 'gordin');
  userEvent.type(screen.getByLabelText(/password/i), 'but-maars');
  userEvent.click(screen.getByTestId('login-form-submit-button'));

  // wait for localstorage to be set after the click
  await screen.findByRole('heading', { name: /weekly time tracking/i });

  let user = localStorage.getItem(CURRENT_USER);
  user = user ? JSON.parse(user).username : user;
  const authToken = localStorage.getItem(AUTH_TOKEN);

  expect(user).toEqual('gordin');
  expect(authToken).toEqual(testToken);
});
