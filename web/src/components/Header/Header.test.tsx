import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

test('header is rendered', () => {
  render(<Header />);
  const linkElement = screen.getByText(/time tracker/i);
  expect(linkElement).toBeInTheDocument();
});

test('header shows currently logged in user', () => {
  const user = {
    username: 'gordin'
  };

  render(<Header user={user} />);
  const userText = screen.getByText(/gordin/i);
  expect(userText).toBeInTheDocument();
});

test('header shows registration button when not signed in', () => {
  render(<Header />);
  const registerButton = screen.getByRole('link', { name: /register/i });
  expect(registerButton).toBeInTheDocument();
});

test('header shows login button when not signed in', () => {
  render(<Header />);
  const loginButton = screen.getByRole('link', { name: /log in/i });
  expect(loginButton).toBeInTheDocument();
});

// show login/register links if not logged in
