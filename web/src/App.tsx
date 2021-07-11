// base component

import React from 'react';
import 'bulma/css/bulma.min.css';
import { Route, Switch } from 'react-router';
import Header from './components/Header/Header';
import Landing from './pages/Landing';
import Home from './pages/Home';
import { User } from './interfaces';
import { CURRENT_USER } from './constants';

const App = () => {
  const storedUser = localStorage.getItem(CURRENT_USER);
  const [user, setUser] = React.useState<User | null>(
    storedUser ? JSON.parse(storedUser) : null
  );

  // render homepage if logged in, landing if not
  let pageContent;
  if (user) {
    pageContent = <Home />;
  } else {
    pageContent = <Landing />;
  }

  return (
    <div>
      <Header user={user || undefined} />
      {pageContent}
    </div>
  );
};

export default App;
