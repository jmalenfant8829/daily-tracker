// File: WorkTimeTable.tsx
// Description: Table containing weekly time spent on various tasks
// First version: 2021/07/19

import React from 'react';
import { Table } from 'react-bulma-components';
import { useTable, Column, TableOptions } from 'react-table';
import EditableCell from '../EditableCell/EditableCell';

interface WorkTimeTableProps {
  startDate: Date;
}

interface EditableTableOptions extends TableOptions<{}> {
  updateData: Function;
}

const DAYS_IN_WEEK = 7;

// retrieves dates through week
function weekdays(date: Date) {
  let weekdaysArr: Date[] = [];

  for (let day = 0; day < DAYS_IN_WEEK; day++) {
    let nextDay = new Date(date);
    nextDay.setHours(0, 0, 0, 0);
    nextDay.setDate(date.getDate() + day);
    weekdaysArr.push(nextDay);
  }
  return weekdaysArr;
}

function dayOfWeekAsString(dayIndex: number) {
  return (
    [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ][dayIndex] || ''
  );
}

// sample dataset
const getData = () => {
  const today = new Date().toISOString().split('T')[0];
  return [{ task: 'task1', [today]: '80' }];
};

const WorkTimeTable = (props: WorkTimeTableProps) => {
  const updateData = (columnId: string, rowIndex: number, value: string) => {
    alert(value);
  };

  const data: Array<any> = React.useMemo(() => getData(), []);
  // table columns
  const columns: Array<Column> = React.useMemo(
    () =>
      [{ Header: 'Task', accessor: 'task' }].concat(
        weekdays(props.startDate).map((weekday) => {
          return {
            Header: dayOfWeekAsString(weekday.getDay()),
            // get 'yyyy-mm-dd' part of ISO date
            accessor: weekday.toISOString().split('T')[0],
            Cell: EditableCell
          };
        })
      ),
    [props.startDate]
  );

  const tableOptions: EditableTableOptions = { columns, data, updateData };
  const workTable = useTable(tableOptions);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    workTable;

  return (
    <Table.Container>
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);

            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Table.Container>
  );
};

export default WorkTimeTable;
