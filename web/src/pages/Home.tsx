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

  // e.g. http://localhost/work-tracking/2021/4/20
  const requestURL =
    process.env.REACT_APP_BACKEND_API +
    ('/work-tracking/' + startDate.getFullYear() + '/') +
    (startDate.getMonth() + 1 + '/' + startDate.getDate());

  const workTimeQuery = useQuery('workTimeData', async () => {
    const authToken = localStorage.getItem(AUTH_TOKEN);
    const res = await fetch(requestURL, {
      headers: { Authorization: 'Bearer ' + authToken }
    });

    if (!res.ok) {
      throw new Error('Error retrieving table data');
    }

    return res.json();
  });

  const updateData = (columnId: string, rowIndex: number, value: string) => {
    alert(value);
  };

  let timetableContent;
  if (workTimeQuery.error) {
    timetableContent = (
      <Notification color="danger">
        Error occurred fetching timetable data.
      </Notification>
    );
  } else if (workTimeQuery.isLoading) {
    timetableContent = <Notification>Loading table</Notification>;
  } else if (workTimeQuery.data['data']) {
    timetableContent = (
      <WorkTimeTable
        startDate={startDate}
        workTimeData={workTimeQuery.data['data']}
        tasks={[
          { name: 'task1', active: true },
          { name: 'task2', active: true },
          { name: 'task3', active: true },
          { name: 'task4', active: false }
        ]}
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
