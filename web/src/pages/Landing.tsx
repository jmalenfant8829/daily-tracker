// File: Landing.tsx
// Description: Landing page for app
// First version: 2021/07/05

import React from 'react';
import 'bulma/css/bulma.min.css';
import { Button, Columns, Heading, Container } from 'react-bulma-components';
import SignupModal from '../components/SignupModal/SignupModal';

const Landing = () => {
  const [showSignup, setShowSignup] = React.useState(false);

  function showSignupModal() {
    setShowSignup(true);
  }

  return (
    <Container>
      <Heading textAlign="center">Time Tracker</Heading>

      <Columns>
        <Columns.Column></Columns.Column>
        <Columns.Column>
          <Button size="large" fullwidth={true} onClick={showSignupModal}>
            Register
          </Button>
        </Columns.Column>
      </Columns>

      <SignupModal
        show={showSignup}
        onClose={() => {
          setShowSignup(false);
        }}
      />
    </Container>
  );
};

export default Landing;
