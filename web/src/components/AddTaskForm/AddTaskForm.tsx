import React from 'react';
import { Form, Button } from 'react-bulma-components';

import { Task } from '../../interfaces';

interface AddTaskFormProps {
  tasks: Task[];
  handleAddTask: (taskName: string) => void;
  handleActivateTask: (taskName: string) => void;
}

const AddTaskForm = (props: AddTaskFormProps) => {
  const [taskName, setTaskName] = React.useState('');
  const inactiveTaskOptions = props.tasks.map((task) => {
    if (!task.active) {
      return (
        <option key={task.name} value={task.name}>
          {task.name}
        </option>
      );
    }
    return null;
  });

  function handleAddTaskSubmit(e: React.FormEvent) {
    e.preventDefault();
    props.handleAddTask(taskName);
  }

  function handleActivateTaskSubmit(e: React.FormEvent) {
    e.preventDefault();
    props.handleActivateTask(taskName);
  }

  return (
    <>
      <form onSubmit={handleAddTaskSubmit}>
        <Form.Field>
          <Form.Label htmlFor="task-name">Task Name</Form.Label>
          <Form.Control>
            <Form.Input
              id="task-name"
              placeholder="My new task"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </Form.Control>
        </Form.Field>

        <Button type="submit">Add New Task</Button>
      </form>

      <form onSubmit={handleActivateTaskSubmit}>
        <Form.Field>
          <Form.Control>
            <Form.Select>{inactiveTaskOptions}</Form.Select>
          </Form.Control>
        </Form.Field>

        <Button type="submit">Add Existing Task</Button>
      </form>
    </>
  );
};

export default AddTaskForm;
