import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { User } from './interfaces';
import { CURRENT_USER } from './constants';

function renderApp(user?: User) {
  if (user) {
    localStorage.setItem(CURRENT_USER, JSON.stringify(user));
  }
  return render(<App />);
}

test('app renders landing header when no user is logged in', () => {
  renderApp();
  const header = screen.getByRole('heading', { name: /time tracker/i });
  expect(header).toBeInTheDocument();
});

test('app renders homepage header when user is logged in', () => {
  renderApp({ username: 'caeda' });
  const header = screen.getByRole('heading', { name: /weekly time tracking/i });
  expect(header).toBeInTheDocument();
});

test('redirects to home page upon successful registration', async () => {
  renderApp();
  userEvent.click(screen.getByRole('button', { name: /register/i }));
  userEvent.type(await screen.findByLabelText(/username/i), 'gordin');
  userEvent.type(screen.getByLabelText(/password/i), 'but-maars');
  userEvent.click(screen.getByTestId('register-form-submit-button'));
  const homePageHeader = await screen.findByRole('heading', {
    name: /weekly time tracking/i
  });
  expect(homePageHeader).toBeInTheDocument();
});
