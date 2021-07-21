import { screen, render } from '@testing-library/react';
import WorkTimeTable from './WorkTimeTable';

test('retrieves and displays task times of current week', () => {
  const date = new Date();
  const isoDate = new Date().toISOString().split('T')[0];
  render(
    <WorkTimeTable
      startDate={date}
      tasks={[{ name: 'task1', active: true }]}
      workTimeData={{ task1: [{ date: isoDate, minutes_spent: 40 }] }}
      updateData={(columnId: string, rowIndex: number, value: string) => {}}
    />
  );
  const taskTimeCell = screen.getByRole('cell', { name: /40/i });
  expect(taskTimeCell).toBeInTheDocument();
});

test('displays active tasks which lack associated times', () => {
  const date = new Date();
  const isoDate = new Date().toISOString().split('T')[0];
  render(
    <WorkTimeTable
      startDate={date}
      workTimeData={{ task1: [{ date: isoDate, minutes_spent: 40 }] }}
      tasks={[
        { name: 'task1', active: true },
        { name: 'task2', active: true }
      ]}
      updateData={(columnId: string, rowIndex: number, value: string) => {}}
    />
  );

  const task2Cell = screen.getByRole('cell', { name: /task2/i });
  expect(task2Cell).toBeInTheDocument();
});

test('does not display inactive tasks', () => {
  const date = new Date();
  const isoDate = new Date().toISOString().split('T')[0];
  render(
    <WorkTimeTable
      startDate={date}
      workTimeData={{ task1: [{ date: isoDate, minutes_spent: 40 }] }}
      tasks={[
        { name: 'task1', active: true },
        { name: 'task2', active: false }
      ]}
      updateData={(columnId: string, rowIndex: number, value: string) => {}}
    />
  );

  const task2Cell = screen.queryByRole('cell', { name: /task2/i });
  expect(task2Cell).not.toBeInTheDocument();
});
