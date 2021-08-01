import React from 'react';
import { Form, Button } from 'react-bulma-components';

import { Task } from '../../interfaces';

interface RemoveTaskFormProps {
  tasks: Task[];
  handleRemoveTask: (taskName: string) => void;
}

const AddTaskForm = (props: RemoveTaskFormProps) => {
  const activeTasks = props.tasks.filter((task) => task.active === true);
  const [selectedTaskName, setSelectedTaskName] = React.useState(
    activeTasks.length > 0 ? activeTasks[0].name : ''
  );
  const activeTaskOptions = activeTasks.map((task) => {
    return (
      <option key={task.name} value={task.name}>
        {task.name}
      </option>
    );
  });

  function handleRemoveTaskSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (selectedTaskName.length > 0) {
      props.handleRemoveTask(selectedTaskName);
    }
  }

  return (
    <>
      <form onSubmit={handleRemoveTaskSubmit}>
        <Form.Field>
          <Form.Control>
            <Form.Select
              value={selectedTaskName}
              onChange={(e) => setSelectedTaskName(e.target.value)}
            >
              {activeTaskOptions}
            </Form.Select>
          </Form.Control>
        </Form.Field>

        <Button type="submit">Remove Selected Task</Button>
      </form>
    </>
  );
};

export default AddTaskForm;
