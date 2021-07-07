// File: SignupModal.test.tsx
// Description: Test modal window for user registration
// First version: 2021/07/05

import { screen, render } from '@testing-library/react';
import SignupModal from './SignupModal';

test('modal renders on screen', () => {
  render(<SignupModal show={true} onClose={() => {}} />);
  const field = screen.getByRole('button', { name: /register/i });
  expect(field).toBeInTheDocument();
});

test('modal does not render on screen if not shown', () => {
  render(<SignupModal show={false} onClose={() => {}} />);
  const field = screen.queryByRole('button', { name: /register/i });
  expect(field).not.toBeInTheDocument();
});
