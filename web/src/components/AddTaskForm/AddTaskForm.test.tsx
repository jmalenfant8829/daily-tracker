import { screen, render } from '@testing-library/react';
import AddTaskForm from './AddTaskForm';

test('renders task creation input field', () => {
  render(<AddTaskForm tasks={[]} />);
  const label = screen.getByLabelText(/task name/i);
  expect(label).toBeInTheDocument();
});

test('shows all currently inactive tasks in dropdown', () => {
  const tasks = [
    { name: 'task1', active: true },
    { name: 'task2', active: false }
  ];
  render(<AddTaskForm tasks={tasks} />);
  const task1Dropdown = screen.queryByRole('option', { name: /task1/ });
  const task2Dropdown = screen.getByRole('option', { name: /task2/ });
  expect(task1Dropdown).not.toBeInTheDocument();
  expect(task2Dropdown).toBeInTheDocument();
});
