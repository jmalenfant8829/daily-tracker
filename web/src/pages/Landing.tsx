// File: Landing.tsx
// Description: Landing page for app
// First version: 2021/07/05

import React from 'react';
import 'bulma/css/bulma.min.css';
import { Button, Columns, Heading, Container } from 'react-bulma-components';
import SignupForm from '../components/SignupForm/SignupForm';
import TitledModal from '../components/TitledModal/TitledModal';
import LoginForm from '../components/LoginForm/LoginForm';

interface LandingProps {
  handleLogin: (username: string, password: string) => Promise<boolean>;
  handleSignup: (username: string, password: string) => Promise<boolean>;
}

const Landing = (props: LandingProps) => {
  const [showSignup, setShowSignup] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);

  function showSignupModal() {
    setShowSignup(true);
  }

  function showLoginModal() {
    setShowLogin(true);
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
          <Button size="large" fullwidth={true} onClick={showLoginModal}>
            Log In
          </Button>
        </Columns.Column>
      </Columns>

      <TitledModal
        show={showSignup}
        onClose={() => {
          setShowSignup(false);
        }}
        children={<SignupForm handleSignup={props.handleSignup} />}
        title="Register"
      />

      <TitledModal
        show={showLogin}
        onClose={() => {
          setShowLogin(false);
        }}
        children={<LoginForm handleLogin={props.handleLogin} />}
        title="Log In"
      />
    </Container>
  );
};

export default Landing;
