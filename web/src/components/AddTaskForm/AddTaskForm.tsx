import React from 'react';
import { Form, Button } from 'react-bulma-components';

import { Task } from '../../interfaces';

interface AddTaskFormProps {
  tasks: Task[];
  handleAddTask: (taskName: string) => void;
  handleActivateTask: (taskName: string) => void;
}

const AddTaskForm = (props: AddTaskFormProps) => {
  const inactiveTasks = props.tasks.filter((task) => task.active === false);

  const [newTaskName, setNewTaskName] = React.useState('');
  const [selectedTaskName, setSelectedTaskName] = React.useState(
    inactiveTasks.length > 0 ? inactiveTasks[0].name : ''
  );
  const inactiveTaskOptions = inactiveTasks.map((task) => {
    return (
      <option key={task.name} value={task.name}>
        {task.name}
      </option>
    );
  });

  function handleAddTaskSubmit(e: React.FormEvent) {
    e.preventDefault();
    props.handleAddTask(newTaskName);
  }

  function handleActivateTaskSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (selectedTaskName.length > 0) {
      props.handleActivateTask(selectedTaskName);
    }
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
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
            />
          </Form.Control>
        </Form.Field>

        <Button type="submit">Add New Task</Button>
      </form>

      <form onSubmit={handleActivateTaskSubmit}>
        <Form.Field>
          <Form.Control>
            <Form.Select
              value={selectedTaskName}
              onChange={(e) => setSelectedTaskName(e.target.value)}
            >
              {inactiveTaskOptions}
            </Form.Select>
          </Form.Control>
        </Form.Field>

        <Button type="submit">Add Existing Task</Button>
      </form>
    </>
  );
};

export default AddTaskForm;
