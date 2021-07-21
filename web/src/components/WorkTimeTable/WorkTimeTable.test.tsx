import { screen, render } from '@testing-library/react';
import WorkTimeTable from './WorkTimeTable';

test('should retrieve and display task times of current week', () => {
  const date = new Date();
  const isoDate = new Date().toISOString().split('T')[0];
  render(
    <WorkTimeTable
      startDate={date}
      workTimeData={{ task1: [{ date: isoDate, minutes_spent: 40 }] }}
      updateData={(columnId: string, rowIndex: number, value: string) => {}}
    />
  );
  const taskTimeCell = screen.getByRole('cell', { name: /40/i });
  expect(taskTimeCell).toBeInTheDocument();
});
