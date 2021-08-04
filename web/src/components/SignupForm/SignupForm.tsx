// File: SignupForm.tsx
// Description: User registration form
// First version: 2021/08/04

import React from 'react';
import { Button, Form, Notification } from 'react-bulma-components';

interface SignupFormProps {
  handleSignup: (username: string, password: string) => Promise<boolean>;
}

const SignupForm = (props: SignupFormProps) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const mounted = React.useRef(false);

  React.useEffect(() => {
    // track whether component is mounted
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const success = await props.handleSignup(username, password);
    // optimally, the async request would be cancelable instead of tracking mount, but for now it's fine
    // https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    if (mounted.current) {
      if (!success) {
        setError('Invalid login or password.');
      } else {
        setError(null);
      }
    }
  }

  let errorNotification = null;

  if (error) {
    errorNotification = <Notification color="danger">{error}</Notification>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {errorNotification}
      <Form.Field>
        <Form.Label htmlFor="username">Username</Form.Label>
        <Form.Control>
          <Form.Input
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Control>
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control>
          <Form.Input
            id="password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Control>
      </Form.Field>

      <Form.Field>
        <Form.Control>
          <Button
            color="link"
            data-testid="register-form-submit-button"
            type="submit"
          >
            Register
          </Button>
        </Form.Control>
      </Form.Field>
    </form>
  );
};

export default SignupForm;
