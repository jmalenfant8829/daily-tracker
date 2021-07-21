import { screen, render } from '@testing-library/react';
import WorkTimeTable from './WorkTimeTable';

test('should retrieve and display task times of current week', () => {
  render(<WorkTimeTable startDate={new Date()} />);
  const taskTimeCell = screen.getByRole('cell', { name: /40/i });
  expect(taskTimeCell).toBeInTheDocument();
});
