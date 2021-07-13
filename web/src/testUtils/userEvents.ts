// repeated user events

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export async function logIn(username: string, password: string) {
  userEvent.click(screen.getByRole('button', { name: /log in/i }));
  userEvent.type(await screen.findByLabelText(/username/i), username);
  userEvent.type(screen.getByLabelText(/password/i), password);
  userEvent.click(screen.getByTestId('login-form-submit-button'));
}
