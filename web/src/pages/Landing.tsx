// File: Landing.tsx
// Description: Landing page for app
// First version: 2021/07/05

import React from 'react';
import 'bulma/css/bulma.min.css';
import { Button } from 'react-bulma-components';
import SignupModal from '../components/SignupModal/SignupModal';

const Landing = () => {
  const [showSignup, setShowSignup] = React.useState(false);

  function showSignupModal() {
    setShowSignup(true);
  }

  return (
    <div>
      <h1>Time Tracker</h1>
      <Button onClick={showSignupModal}>Register</Button>
      <SignupModal
        show={showSignup}
        onClose={() => {
          setShowSignup(false);
        }}
      />
    </div>
  );
};

export default Landing;
