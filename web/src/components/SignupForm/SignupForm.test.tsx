import { screen, render } from '@testing-library/react';

import SignupForm from './SignupForm';

test('should render signup form', () => {
  render(
    <SignupForm
      handleSignup={async (username: string, password: string) => {
        return false;
      }}
    />
  );
  const label = screen.getByRole('button', { name: /register/i });
  expect(label).toBeInTheDocument();
});
