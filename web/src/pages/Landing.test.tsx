// File: Landing.test.tsx
// Description: Tests app landing page
// First version: 2021/07/05

import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import App from '../App';
import Landing from './Landing';

test('landing page renders', () => {
  render(<Landing />);
  const title = screen.getByText(/time tracker/i);
  expect(title).toBeInTheDocument();
});

test('shows landing page at site root', () => {
  render(<App />, { wrapper: MemoryRouter });
  const header = screen.getByRole('heading', { name: /time tracker/i });
  expect(header).toBeInTheDocument();
});

test('opens registration modal on button click', () => {
  const { rerender } = render(<Landing />);
  const button = screen.getByRole('button', { name: /register/i });
  userEvent.click(button);

  rerender(<Landing />);
  const field = screen.getByTestId('register-form-submit-button');
  expect(field).toBeInTheDocument();
});

test('opens login modal on button click', () => {
  const { rerender } = render(<Landing />);
  const button = screen.getByRole('button', { name: /log in/i });
  userEvent.click(button);

  rerender(<Landing />);
  const field = screen.getByTestId('login-form-submit-button');
  expect(field).toBeInTheDocument();
});
