// File: Landing.tsx
// Description: Modal window for user registration
// First version: 2021/07/05

import { Button, Form, Modal } from 'react-bulma-components';

interface SignupModalProps {
  show: boolean;
  onClose: () => void;
}

const SignupModal = (props: SignupModalProps) => {
  return (
    <Modal show={props.show} onClose={props.onClose} showClose={false}>
      <Modal.Card>
        <Modal.Card.Header>
          <Modal.Card.Title>Register</Modal.Card.Title>
        </Modal.Card.Header>
        <Modal.Card.Body>
          <form>
            <Form.Field>
              <Form.Label htmlFor="username">Username</Form.Label>
              <Form.Control>
                <Form.Input id="username" placeholder="Username" />
              </Form.Control>
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control>
                <Form.Input id="password" placeholder="Password" />
              </Form.Control>
            </Form.Field>

            <Form.Field>
              <Form.Control>
                <Button color="link">Register</Button>
              </Form.Control>
            </Form.Field>
          </form>
        </Modal.Card.Body>
      </Modal.Card>
    </Modal>
  );
};

export default SignupModal;
