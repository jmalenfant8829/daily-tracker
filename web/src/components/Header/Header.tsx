// site header

import React from 'react';
import { User } from '../../interfaces';
import { Navbar } from 'react-bulma-components';
import TitledModal from '../TitledModal/TitledModal';
import LoginForm from '../LoginForm/LoginForm';

interface HeaderProps {
  user?: User;
  handleLogin: (username: string, password: string) => Promise<boolean>;
  handleLogout: () => void;
}

function Header(props: HeaderProps) {
  const [showLogin, setShowLogin] = React.useState(false);

  function showLoginModal() {
    setShowLogin(true);
  }

  function onLogout(e: React.FormEvent) {
    props.handleLogout();
  }

  let userNavOptions;
  if (props.user) {
    userNavOptions = (
      <Navbar.Container align="right">
        <Navbar.Item>{props.user.username}</Navbar.Item>
        <Navbar.Item href="#" onClick={onLogout}>
          Log Out
        </Navbar.Item>
      </Navbar.Container>
    );
  } else {
    userNavOptions = (
      <Navbar.Container align="right">
        <Navbar.Item href="#">Register</Navbar.Item>
        <Navbar.Item href="#" onClick={showLoginModal}>
          Log In
        </Navbar.Item>
        <TitledModal
          show={showLogin}
          onClose={() => {
            setShowLogin(false);
          }}
          children={<LoginForm handleLogin={props.handleLogin} />}
          title="Log In"
        />
      </Navbar.Container>
    );
  }

  return (
    <Navbar>
      <Navbar.Menu>
        <Navbar.Container>
          <Navbar.Item>Time Tracker</Navbar.Item>
        </Navbar.Container>
        {userNavOptions}
      </Navbar.Menu>
    </Navbar>
  );
}

export default Header;
