import { screen, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AUTH_TOKEN } from '../constants';
import { testToken, initMockStorage } from '../mocks/handlers';

import Home from './Home';

beforeEach(() => {
  initMockStorage();
});

afterEach(() => {
  sessionStorage.clear();
});

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
  const cell = await screen.findByRole('cell', { name: /20/i });
  const cellInput = within(cell).getByDisplayValue(/20/i);
  userEvent.type(cellInput, '80');
  const saveButton = screen.getByRole('button', { name: /save changes/i });
  userEvent.click(saveButton);
  renderHomePage();
  const editedCell = await screen.findByRole('cell', { name: /2080/i });
  expect(editedCell).toBeInTheDocument();
});
