// File: WeekSelector.tsx
// Description: Allows selection of a specific week
// First version: 2021/08/02

import React from 'react';
import { getLastSunday } from '../../helpers';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';

interface WeekSelectorProps {
  startDate?: Date;
  handleWeekSelect: (selectedDate: Date) => void;
}

const WeekSelector = (props: WeekSelectorProps) => {
  const [selectedDay, setSelectedDay] = React.useState(
    props.startDate ? props.startDate : getLastSunday(new Date())
  );

  function parseDate(str: string, format: string, locale: any) {
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    if (DateUtils.isDate(parsed)) {
      return parsed;
    }
    return undefined;
  }

  function formatDate(date: Date, format: string, locale: any) {
    return dateFnsFormat(date, format, { locale });
  }

  function handleDaySelection(date: Date) {
    setSelectedDay(getLastSunday(date));
    props.handleWeekSelect(getLastSunday(date));
  }

  return (
    <>
      <DayPickerInput
        value={selectedDay}
        formatDate={formatDate}
        parseDate={parseDate}
        format="yyyy-MM-dd"
        onDayChange={handleDaySelection}
        inputProps={{
          readOnly: true
        }}
      />
    </>
  );
};

export default WeekSelector;
