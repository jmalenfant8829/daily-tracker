// reused type declarations

export interface User {
  username: string;
}

// format of work time data sent to/from the API
export interface APIWorkTimeData {
  [task: string]: [{ date: string; minutes_spent: number }];
}
