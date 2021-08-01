// File: Home.tsx
// Description: User's home page containing time tracking info/functionality
// First version: 2021/07/09

import React from 'react';
import {
  Container,
  Heading,
  Notification,
  Button
} from 'react-bulma-components';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import WorkTimeTable from '../components/WorkTimeTable/WorkTimeTable';
import TitledModal from '../components/TitledModal/TitledModal';
import AddTaskForm from '../components/AddTaskForm/AddTaskForm';
import { getLastSunday } from '../helpers';
import { AUTH_TOKEN } from '../constants';
import { APIWorkTimeData, Task } from '../interfaces';

const WORK_TIME_QUERY = 'workTimeData';
const TASK_LIST_QUERY = 'taskListData';

const Home = () => {
  // which day the timetable starts with (default sunday of current week)
  const [startDate, setStartDate] = React.useState(getLastSunday());
  // user-edited times on the table which can then be POSTed
  const [editedTimes, setEditedTimes] = React.useState<APIWorkTimeData>({});
  // toggle for showing 'add task' modal
  const [showAddTask, setShowAddTask] = React.useState(false);

  const mounted = React.useRef(false);

  React.useEffect(() => {
    // track whether component is mounted
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  function showAddTaskModal() {
    setShowAddTask(true);
  }

  // work time api query
  const workTimeQuery = useQuery(WORK_TIME_QUERY, async () => {
    // e.g. http://localhost/work-tracking/2021/4/20
    const requestURL =
      process.env.REACT_APP_BACKEND_API +
      ('/work-tracking/' + startDate.getFullYear() + '/') +
      (startDate.getMonth() + 1 + '/' + startDate.getDate());

    const res = await fetch(requestURL, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem(AUTH_TOKEN) }
    });

    if (!res.ok) {
      throw new Error('Error retrieving table data');
    }

    return res.json();
  });

  // task list api query
  const taskListQuery = useQuery(TASK_LIST_QUERY, async () => {
    const requestURL = process.env.REACT_APP_BACKEND_API + '/task';
    const res = await fetch(requestURL, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem(AUTH_TOKEN) }
    });

    if (!res.ok) {
      throw new Error('Error retrieving task data');
    }

    return res.json();
  });

  const queryClient = useQueryClient();

  const workTimeMutation = useMutation(
    async (workTimes: APIWorkTimeData) => {
      const requestURL = process.env.REACT_APP_BACKEND_API + '/work-tracking';

      await fetch(requestURL, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem(AUTH_TOKEN)
        },
        body: JSON.stringify(workTimes)
      });
    },
    {
      onSuccess: () => {
        // reset work time data to reflect posted data
        queryClient.invalidateQueries(WORK_TIME_QUERY);

        if (mounted.current) {
          setEditedTimes({});
        }
      }
    }
  );

  // add new task
  const addTaskMutation = useMutation(
    async (taskName: string) => {
      const requestURL = process.env.REACT_APP_BACKEND_API + '/task';

      await fetch(requestURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem(AUTH_TOKEN)
        },
        body: JSON.stringify({ name: taskName })
      });
    },
    {
      onSuccess: () => {
        // reflect new task data
        queryClient.invalidateQueries(TASK_LIST_QUERY);
      }
    }
  );

  // set task active/inactive
  const taskActiveMutation = useMutation(async (task: Task) => {
    const requestURL =
      process.env.REACT_APP_BACKEND_API +
      ('/task/' + encodeURIComponent(task.name));

    await fetch(requestURL, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem(AUTH_TOKEN)
      },
      body: JSON.stringify({ active: task.active })
    });
  });

  // when data is updated, add it to the edited times
  const updateData = (columnId: string, taskName: string, value: number) => {
    let newEditedTimes = { ...editedTimes };

    // initialize array with the edited time if array for this task is nonexistent
    if (!newEditedTimes.hasOwnProperty(taskName)) {
      newEditedTimes[taskName] = [{ date: columnId, minutes_spent: value }];
    } else {
      // update value if time has already been edited
      for (let i = 0; i < newEditedTimes[taskName].length; i++) {
        let found = false;
        if (newEditedTimes[taskName][i].date === columnId) {
          newEditedTimes[taskName][i].minutes_spent = value;
          found = true;
          break;
        }

        // add value if this is the first edit
        if (!found) {
          newEditedTimes[taskName].push({
            date: columnId,
            minutes_spent: value
          });
        }
      }
    }

    setEditedTimes(newEditedTimes);
  };

  let timetableContent;
  if (workTimeQuery.error || taskListQuery.error) {
    timetableContent = (
      <Notification color="danger">
        Error occurred fetching timetable data.
      </Notification>
    );
  } else if (workTimeQuery.isLoading || taskListQuery.isLoading) {
    timetableContent = <Notification>Loading table</Notification>;
  } else if (workTimeQuery.data['data'] && taskListQuery.data['data']) {
    timetableContent = (
      <>
        <WorkTimeTable
          startDate={startDate}
          workTimeData={workTimeQuery.data['data']}
          tasks={taskListQuery.data['data']}
          updateData={updateData}
        />
        <Button
          onClick={() => {
            // no point posting if no times are edited
            if (Object.keys(editedTimes).length > 0) {
              workTimeMutation.mutate(editedTimes);
            }
          }}
        >
          Save Changes
        </Button>

        <TitledModal
          show={showAddTask}
          onClose={() => {
            setShowAddTask(false);
          }}
          children={
            <AddTaskForm
              handleAddTask={handleAddTask}
              handleActivateTask={handleActivateTask}
              tasks={taskListQuery.data['data']}
            />
          }
          title="Add Task"
        />
        <Button onClick={showAddTaskModal}>Add Task</Button>
      </>
    );
  }

  function handleAddTask(taskName: string) {
    addTaskMutation.mutate(taskName);
    setShowAddTask(false);
  }

  function handleActivateTask(taskName: string) {
    taskActiveMutation.mutate({ name: taskName, active: true });
    setShowAddTask(false);
  }

  return (
    <Container>
      <Heading>Weekly Time Tracking</Heading>
      {timetableContent}
    </Container>
  );
};

export default Home;
