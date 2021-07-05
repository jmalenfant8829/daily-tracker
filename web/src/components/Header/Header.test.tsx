
import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

test('app renders header', () => {
  render(<Header />);
  const linkElement = screen.getByText(/time tracker/i);
  expect(linkElement).toBeInTheDocument();
});
