import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('app renders header', () => {
  render(<App />);
  const linkElement = screen.getByRole('heading');
  expect(linkElement).toBeInTheDocument();
});
