import React from 'react';
import { Row, Column } from 'react-table';
import { Form } from 'react-bulma-components';

interface EditableCellProps {
  value: string;
  row: Row;
  column: Column;
  updateData: Function;
}

const EditableCell = (props: EditableCellProps) => {
  const [value, setValue] = React.useState(props.value ? props.value : '');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function handleBlur(e: React.FocusEvent) {
    props.updateData(props.column.id, props.row.index, value);
  }

  return (
    <Form.Input onBlur={handleBlur} onChange={handleChange} value={value} />
  );
};

export default EditableCell;
