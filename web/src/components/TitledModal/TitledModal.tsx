// File: ModalForm.tsx
// Description: Modal containing a form
// First version: 2021/07/09

import { Modal } from 'react-bulma-components';
import FocusLock from 'react-focus-lock';

interface ModalFormProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const TitledModal = (props: ModalFormProps) => {
  return (
    <Modal show={props.show} onClose={props.onClose} showClose={false}>
      <Modal.Card>
        <Modal.Card.Header>
          <Modal.Card.Title>{props.title}</Modal.Card.Title>
        </Modal.Card.Header>
        <Modal.Card.Body>
          <FocusLock>{props.children}</FocusLock>
        </Modal.Card.Body>
      </Modal.Card>
    </Modal>
  );
};

export default TitledModal;
