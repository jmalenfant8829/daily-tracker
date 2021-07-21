import { screen, render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import Home from './Home';

function renderHomePage() {
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
