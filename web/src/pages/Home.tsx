// File: Home.tsx
// Description: User's home page containing time tracking info/functionality
// First version: 2021/07/09

import React from 'react';
import { Container, Heading, Notification } from 'react-bulma-components';
import { useQuery } from 'react-query';
import WorkTimeTable from '../components/WorkTimeTable/WorkTimeTable';
import { getLastSunday } from '../helpers';
import { AUTH_TOKEN } from '../constants';

const Home = () => {
  // which day the timetable starts with (default sunday of current week)
  const [startDate, setStartDate] = React.useState(getLastSunday());

  // work time api query
  const workTimeQuery = useQuery('workTimeData', async () => {
    // e.g. http://localhost/work-tracking/2021/4/20
    const requestURL =
      process.env.REACT_APP_BACKEND_API +
      ('/work-tracking/' + startDate.getFullYear() + '/') +
      (startDate.getMonth() + 1 + '/' + startDate.getDate());

    const authToken = localStorage.getItem(AUTH_TOKEN);
    const res = await fetch(requestURL, {
      headers: { Authorization: 'Bearer ' + authToken }
    });

    if (!res.ok) {
      throw new Error('Error retrieving table data');
    }

    return res.json();
  });

  // task list api query
  const taskListQuery = useQuery('taskListData', async () => {
    const requestURL = process.env.REACT_APP_BACKEND_API + '/task';
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const res = await fetch(requestURL, {
      headers: { Authorization: 'Bearer ' + authToken }
    });

    if (!res.ok) {
      throw new Error('Error retrieving task data');
    }

    return res.json();
  });

  const updateData = (columnId: string, rowIndex: number, value: string) => {
    alert(value);
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
      <WorkTimeTable
        startDate={startDate}
        workTimeData={workTimeQuery.data['data']}
        tasks={taskListQuery.data['data']}
        updateData={updateData}
      />
    );
  }

  return (
    <Container>
      <Heading>Weekly Time Tracking</Heading>
      {timetableContent}
    </Container>
  );
};

export default Home;
