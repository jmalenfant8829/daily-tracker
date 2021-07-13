import { screen, render } from '@testing-library/react';
import Home from './Home';

test('should render home page', () => {
  render(<Home />);
  const heading = screen.getByRole('heading', {
    name: /weekly time tracking/i
  });
  expect(heading).toBeInTheDocument();
});
