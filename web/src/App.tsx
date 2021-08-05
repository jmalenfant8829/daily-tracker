// base component

import React from 'react';
import 'bulma/css/bulma.min.css';
import Header from './components/Header/Header';
import Landing from './pages/Landing';
import Home from './pages/Home';
import { QueryClient, QueryClientProvider } from 'react-query';
import { User } from './interfaces';
import { CURRENT_USER, AUTH_TOKEN } from './constants';

// use mock server for development
if (process.env.REACT_APP_USE_MSW === 'true') {
  const { worker } = require('./mocks/browser');
  const { initMockStorage } = require('./mocks/handlers');
  initMockStorage();
  worker.start();
}

const queryClient = new QueryClient();

const App = () => {
  const storedUser = localStorage.getItem(CURRENT_USER);
  const [user, setUser] = React.useState<User | null>(
    storedUser ? JSON.parse(storedUser) : null
  );

  function logOutUser() {
    localStorage.removeItem(CURRENT_USER);
    localStorage.removeItem(AUTH_TOKEN);
    setUser(null);
  }

  // attempts to log in a user given a username/password
  async function logInUser(username: string, password: string) {
    // issue api call for token
    let loginSuccessful = false;
    try {
      const res = await fetch(process.env.REACT_APP_BACKEND_API + '/token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
      });

      // set current user
      const jsonData = await res.json();
      if (res.status === 200) {
        const user = { username: username };
        setUser(user);
        localStorage.setItem(CURRENT_USER, JSON.stringify(user));
        localStorage.setItem(AUTH_TOKEN, jsonData.data.token);
        loginSuccessful = true;
      }
    } catch (err) {
      console.error(err);
    }
    return loginSuccessful;
  }

  async function signUpUser(username: string, password: string) {
    let successfulSignup = false;
    try {
      const res = await fetch(process.env.REACT_APP_BACKEND_API + '/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
      });

      if (res.status === 200) {
        successfulSignup = true;
        // todo: handle login failure - shouldn't happen after registration, but still important
        await logInUser(username, password);
      }
    } catch (err) {
      console.error(err);
    }

    return successfulSignup;
  }

  // render homepage if logged in, landing if not
  let pageContent;
  if (user) {
    pageContent = (
      <QueryClientProvider client={queryClient}>
        <Home />;
      </QueryClientProvider>
    );
  } else {
    pageContent = <Landing handleLogin={logInUser} handleSignup={signUpUser} />;
  }

  return (
    <div>
      <Header
        user={user || undefined}
        handleLogin={logInUser}
        handleLogout={logOutUser}
      />
      {pageContent}
    </div>
  );
};

export default App;
