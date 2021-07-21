// File: Home.tsx
// Description: User's home page containing time tracking info/functionality
// First version: 2021/07/09

import React from 'react';
import { Container, Heading } from 'react-bulma-components';
import WorkTimeTable from '../components/WorkTimeTable/WorkTimeTable';

// gets date of last Sunday from the given date
function getLastSunday(date?: Date) {
  // current date if not given
  let givenDate = date ? new Date(date) : new Date();
  givenDate.setHours(0, 0, 0, 0);

  // date minus X days into week (sunday=-0, monday=-1, etc.)
  let sunday = new Date();
  sunday.setDate(givenDate.getDate() - givenDate.getDay());
  return sunday;
}

const Home = () => {
  // which day the timetable starts with (default sunday of current week)
  const [startDate, setStartDate] = React.useState(getLastSunday());

  return (
    <Container>
      <Heading>Weekly Time Tracking</Heading>
      <WorkTimeTable startDate={startDate} />
    </Container>
  );
};

export default Home;
