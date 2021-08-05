// gets date of last Sunday from the given date
export function getLastSunday(date?: Date) {
  // current date if not given
  let givenDate = date ? new Date(date) : new Date();
  givenDate.setHours(0, 0, 0, 0);

  // date minus X days into week (sunday=-0, monday=-1, etc.)
  let sunday = new Date();
  sunday.setDate(givenDate.getDate() - givenDate.getDay());
  return sunday;
}

export function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// handle api response error
export default function handleErrors(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}
