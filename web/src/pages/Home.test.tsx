import { screen, render } from '@testing-library/react';
import Home from './Home';

test('should render home page header', () => {
  render(<Home />);
  const heading = screen.getByRole('heading', {
    name: /weekly time tracking/i
  });
  expect(heading).toBeInTheDocument();
});

test('should render weekly time table', () => {
  render(<Home />);
  const headingCell = screen.getByRole('cell', { name: /sunday/i });
  expect(headingCell).toBeInTheDocument();
});
