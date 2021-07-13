import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';
import userEvent from '@testing-library/user-event';
import { User } from '../../interfaces';
import App from '../../App';
import { logIn } from '../../testUtils/userEvents';

// dummy login callback
const handleLogin = async (u: string, p: string) => {
  return await true;
};

const handleLogout = () => {
  return;
};

const renderHeader = (user?: User) => {
  render(
    <Header user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
  );
};

test('header is rendered', () => {
  renderHeader();
  const linkElement = screen.getByText(/time tracker/i);
  expect(linkElement).toBeInTheDocument();
});

test('header shows currently logged in user', () => {
  renderHeader({ username: 'gordin' });
  const userText = screen.getByText(/gordin/i);
  expect(userText).toBeInTheDocument();
});

test('header shows registration button when not signed in', () => {
  renderHeader();
  const registerButton = screen.getByRole('link', { name: /register/i });
  expect(registerButton).toBeInTheDocument();
});

test('header shows login button when not signed in', () => {
  renderHeader();
  const loginButton = screen.getByRole('link', { name: /log in/i });
  expect(loginButton).toBeInTheDocument();
});

test('header launches login modal', async () => {
  renderHeader();
  const loginButton = screen.getByRole('link', { name: /log in/i });
  userEvent.click(loginButton);

  const modalSubmit = await screen.findByTestId('login-form-submit-button');
  expect(modalSubmit).toBeInTheDocument();
});

test('header logout button logs user out', async () => {
  // log user in
  render(<App />);
  await logIn('gordin', 'but-maars');
  const logoutButton = await screen.findByRole('link', { name: /log out/i });
  userEvent.click(logoutButton);

  const loggedOutHeader = await screen.findByRole('heading', {
    name: /time tracker/i
  });
  expect(loggedOutHeader).toBeInTheDocument();
});
