import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RemoveTaskForm from './RemoveTaskForm';

test('renders active tasks in dropdown', () => {
  const tasks = [
    { name: 'task1', active: true },
    { name: 'task2', active: true },
    { name: 'task3', active: false }
  ];
  render(<RemoveTaskForm tasks={tasks} handleRemoveTask={() => {}} />);
  const task3Option = screen.getByRole('option', { name: /task1/ });
  expect(task3Option).toBeInTheDocument();
});

test('does not render inactive tasks in dropdown', () => {
  const tasks = [
    { name: 'task1', active: true },
    { name: 'task2', active: true },
    { name: 'task3', active: false }
  ];
  render(<RemoveTaskForm tasks={tasks} handleRemoveTask={() => {}} />);
  const task1Option = screen.queryByRole('option', { name: /task3/ });
  expect(task1Option).not.toBeInTheDocument();
});

test('handles removal button click with selected option', () => {
  const tasks = [
    { name: 'task1', active: true },
    { name: 'task2', active: true },
    { name: 'task3', active: false }
  ];
  let selectedTaskName = '';
  const handleRemove = (taskName: string) => {
    selectedTaskName = taskName;
  };
  render(<RemoveTaskForm tasks={tasks} handleRemoveTask={handleRemove} />);
  userEvent.selectOptions(screen.getByRole('combobox'), ['task2']);
  userEvent.click(
    screen.getByRole('button', { name: /remove selected task/i })
  );

  // should have triggered function to set the variable
  expect(selectedTaskName).toEqual('task2');
});
