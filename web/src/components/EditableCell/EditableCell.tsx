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
    let numValue;

    if (value.toString().trim() === '') {
      numValue = 0;
    } else {
      numValue = Number(value.toString().trim());
    }

    if (!isNaN(numValue)) {
      props.updateData(props.column.id, props.row.values['task'], numValue);
    }
  }

  return (
    <Form.Input
      onBlur={handleBlur}
      onChange={handleChange}
      type="text"
      value={value}
    />
  );
};

export default EditableCell;
