// File: WeekSelector.tsx
// Description: Tests WeekSelector component
// First version: 2021/08/02

import { screen, render } from '@testing-library/react';
import WeekSelector from './WeekSelector';
import { getLastSunday } from '../../helpers';
import userEvent from '@testing-library/user-event';

test('should have current week selected by default', () => {
  render(<WeekSelector handleWeekSelect={(date) => {}} />);
  const date = getLastSunday(new Date());
  const weekLabel = screen.getByDisplayValue(date.toISOString().split('T')[0]);
  expect(weekLabel).toBeInTheDocument();
});

test('should trigger callback for first day of week on day selection', () => {
  let str = '';
  const callback = (d: Date) => {
    str = d.toISOString().split('T')[0];
  };

  render(<WeekSelector handleWeekSelect={callback} />);
  userEvent.click(screen.getByRole('textbox'));
  const date = new Date();
  const dateCell = screen.getByRole('gridcell', {
    name: getLastSunday(date).toDateString()
  });
  userEvent.click(dateCell);

  expect(str).toEqual(getLastSunday(date).toISOString().split('T')[0]);
});
