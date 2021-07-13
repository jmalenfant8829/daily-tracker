// File: Landing.test.tsx
// Description: Tests app landing page
// First version: 2021/07/05

import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Landing from './Landing';

const renderLanding = () => {
  const handleLogin = async (username: string, password: string) => {
    return true;
  };
  return render(<Landing handleLogin={handleLogin} />);
};

test('landing page renders', () => {
  renderLanding();
  const title = screen.getByText(/time tracker/i);
  expect(title).toBeInTheDocument();
});

test('shows landing page at site root', () => {
  renderLanding();
  const header = screen.getByRole('heading', { name: /time tracker/i });
  expect(header).toBeInTheDocument();
});

test('opens registration modal on button click', async () => {
  renderLanding();
  const button = screen.getByRole('button', { name: /register/i });
  userEvent.click(button);

  const field = await screen.findByTestId('register-form-submit-button');
  expect(field).toBeInTheDocument();
});

test('opens login modal on button click', async () => {
  renderLanding();
  const button = screen.getByRole('button', { name: /log in/i });
  userEvent.click(button);

  const field = await screen.findByTestId('login-form-submit-button');
  expect(field).toBeInTheDocument();
});
