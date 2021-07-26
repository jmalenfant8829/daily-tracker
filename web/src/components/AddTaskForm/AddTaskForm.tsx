import React from 'react';
import { Form } from 'react-bulma-components';

import { Task } from '../../interfaces';

interface AddTaskFormProps {
  tasks: Task[];
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

  return (
    <>
      <form>
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
        {/* <Form.Radio name='add-activate-toggle'>

        </Form.Radio>
        <Form.Radio name='add-activate-toggle'>

        </Form.Radio> */}

        <Form.Field>
          <Form.Control>
            <Form.Select>{inactiveTaskOptions}</Form.Select>
          </Form.Control>
        </Form.Field>
      </form>
    </>
  );
};

export default AddTaskForm;
