// site header

import { User } from '../../interfaces';
import { Navbar } from 'react-bulma-components';

interface HeaderProps {
  user?: User;
}

function Header(props: HeaderProps) {
  let userNavOptions;
  if (props.user) {
    userNavOptions = (
      <Navbar.Container align="right">
        <Navbar.Item>{props.user.username}</Navbar.Item>
      </Navbar.Container>
    );
  } else {
    userNavOptions = (
      <Navbar.Container align="right">
        <Navbar.Item href="#">Register</Navbar.Item>
        <Navbar.Item href="#">Log In</Navbar.Item>
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
