import { screen, render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AUTH_TOKEN } from '../constants';
import { testToken } from '../mocks/handlers';
import userEvent from '@testing-library/user-event';

import Home from './Home';

function renderHomePage() {
  localStorage.setItem(AUTH_TOKEN, testToken);
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}

test('should render home page header', () => {
  renderHomePage();
  const heading = screen.getByRole('heading', {
    name: /weekly time tracking/i
  });
  expect(heading).toBeInTheDocument();
});

test('should render weekly time table', async () => {
  renderHomePage();
  const headingCell = await screen.findByRole('columnheader', {
    name: /sunday/i
  });
  expect(headingCell).toBeInTheDocument();
});

test('should save change made to time table cell', async () => {
  renderHomePage();
  const inputCell = await screen.findByRole('cell', { name: /20/i });
  userEvent.type(inputCell, '80');
  const saveButton = screen.getByRole('button', { name: /save changes/i });
  userEvent.click(saveButton);
  renderHomePage();
  const editedCell = await screen.findByRole('cell', { name: /80/i });
  expect(editedCell).toBeInTheDocument();
});
