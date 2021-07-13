// TODO add validation

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

//test('login form should reject blank username submission')n

test('redirects to home page upon successful login', async () => {
  const { rerender } = render(<App />);
  userEvent.click(screen.getByRole('button', { name: /log in/i }));
  rerender(<App />);

  userEvent.type(screen.getByLabelText(/username/i), 'gordin');
  userEvent.type(screen.getByLabelText(/password/i), 'but-maars');

  userEvent.click(screen.getByTestId('login-form-submit-button'));

  const homePageHeader = await screen.findByRole('heading', {
    name: /weekly time tracking/i
  });

  expect(homePageHeader).toBeInTheDocument();
});

test('reports error message upon failing to log in', async () => {
  const { rerender } = render(<App />);
  userEvent.click(screen.getByRole('button', { name: /log in/i }));
  rerender(<App />);

  userEvent.type(screen.getByLabelText(/username/i), 'gordin');
  userEvent.type(screen.getByLabelText(/password/i), 'wrong-password');

  userEvent.click(screen.getByTestId('login-form-submit-button'));
  rerender(<App />);

  const error = await screen.findByText(/invalid login or password./i);
  expect(error).toBeInTheDocument();
});
