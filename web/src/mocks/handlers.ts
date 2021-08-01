// mock handlers for mock-service-worker

import { rest, ResponseComposition, RestContext } from 'msw';
import { APIWorkTimeData, Task } from '../interfaces';

// 'existing' users
const users = [{ username: 'gordin', password: 'but-maars' }];
// sample auth token
export const testToken = 'my-secret-token';

// session storage keys
const WORK_TIMES_KEY = 'MSW_WORK_TIMES';
const TASK_LIST_KEY = 'MSW_TASK_LIST';

// session storage values for testing
export const initMockStorage = () => {
  const workTimes = [
    { task: 'task1', dayOffset: 1, minutes_spent: 20 },
    { task: 'task2', dayOffset: 2, minutes_spent: 40 }
  ];
  sessionStorage.setItem(WORK_TIMES_KEY, JSON.stringify(workTimes));

  const tasks = [
    { name: 'task1', active: true },
    { name: 'task2', active: true },
    { name: 'task3', active: false }
  ];
  sessionStorage.setItem(TASK_LIST_KEY, JSON.stringify(tasks));
};

// creates api url
const backendPath = (path: string) => {
  return process.env.REACT_APP_BACKEND_API + path;
};

const invalidTokenResponse = (res: ResponseComposition, ctx: RestContext) => {
  return res(
    ctx.status(401),
    ctx.json({
      status: 'error',
      data: null,
      message: 'Invalid token.'
    })
  );
};

export const handlers = [
  // get api token
  rest.post(backendPath('/token'), (req: Record<string, any>, res, ctx) => {
    const username = req.body.username;
    const password = req.body.password;

    if (
      // return true if user is in array
      users.some(
        (user) => user.username === username && user.password === password
      )
    ) {
      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          data: { token: testToken },
          message: null
        })
      );
    } else {
      return res(
        ctx.status(401),
        ctx.json({
          status: 'error',
          data: null,
          message: 'Invalid login or password'
        })
      );
    }
  }),
  // get sample work week starting from given day
  rest.get(
    backendPath('/work-tracking/:year/:month/:day'),
    (req: Record<string, any>, res, ctx) => {
      if (req.headers.get('Authorization') !== 'Bearer ' + testToken) {
        return invalidTokenResponse(res, ctx);
      }

      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);
      const day = parseInt(req.params.day);

      // assemble work time response for session storage
      const storageWorkTimes = sessionStorage.getItem(WORK_TIMES_KEY);
      let workTimeData: APIWorkTimeData = {};
      if (storageWorkTimes) {
        const workTimes = JSON.parse(storageWorkTimes);
        for (const workTime of workTimes) {
          const date = new Date(year, month - 1, day + workTime.dayOffset);
          const dateStr = date.toISOString().split('T')[0];

          if (!workTimeData.hasOwnProperty(workTime.task)) {
            workTimeData[workTime.task] = [
              { date: dateStr, minutes_spent: workTime.minutes_spent }
            ];
          } else {
            workTimeData[workTime.task].push({
              date: dateStr,
              minutes_spent: workTime.minutes_spent
            });
          }
        }
      }

      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          data: workTimeData,
          message: null
        })
      );
    }
  ),
  // get user's tasks
  rest.get(backendPath('/task'), (req: Record<string, any>, res, ctx) => {
    if (req.headers.get('Authorization') !== 'Bearer ' + testToken) {
      return invalidTokenResponse(res, ctx);
    }

    const storageTasks = sessionStorage.getItem(TASK_LIST_KEY);
    const tasks = storageTasks ? JSON.parse(storageTasks) : [];

    return res(
      ctx.status(200),
      ctx.json({
        status: 'success',
        data: tasks,
        message: null
      })
    );
  }),
  // add task
  rest.post(backendPath('/task'), (req: Record<string, any>, res, ctx) => {
    if (req.headers.get('Authorization') !== 'Bearer ' + testToken) {
      return invalidTokenResponse(res, ctx);
    }

    const storageTasks = sessionStorage.getItem(TASK_LIST_KEY);
    const tasks = storageTasks ? JSON.parse(storageTasks) : [];

    tasks.push({ name: req.body.name, active: true });
    sessionStorage.setItem(TASK_LIST_KEY, JSON.stringify(tasks));

    return res(
      ctx.status(200),
      ctx.json({
        status: 'success',
        data: null,
        message: null
      })
    );
  }),
  // edit task
  rest.patch(
    backendPath('/task/:taskName'),
    (req: Record<string, any>, res, ctx) => {
      if (req.headers.get('Authorization') !== 'Bearer ' + testToken) {
        return invalidTokenResponse(res, ctx);
      }

      const storageTasks = sessionStorage.getItem(TASK_LIST_KEY);
      let tasks: Task[] = storageTasks ? JSON.parse(storageTasks) : [];

      tasks.map((task) => {
        if (task.name === req.params.taskName) {
          task.active = req.body.active;
        }
        return task;
      });

      sessionStorage.setItem(TASK_LIST_KEY, JSON.stringify(tasks));

      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          data: null,
          message: null
        })
      );
    }
  ),
  // update work times
  rest.put(
    backendPath('/work-tracking'),
    (req: Record<string, any>, res, ctx) => {
      if (req.headers.get('Authorization') !== 'Bearer ' + testToken) {
        return invalidTokenResponse(res, ctx);
      }

      const storageWorkTimes = sessionStorage.getItem(WORK_TIMES_KEY);
      let workTimes = storageWorkTimes ? JSON.parse(storageWorkTimes) : [];

      for (const task in req.body) {
        for (const { date, minutes_spent } of req.body[task]) {
          const dayOffset = new Date(date + 'T00:00:00').getDay();
          workTimes.push({
            task: task,
            dayOffset: dayOffset,
            minutes_spent: minutes_spent
          });
        }
      }

      sessionStorage.setItem(WORK_TIMES_KEY, JSON.stringify(workTimes));

      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          data: null,
          message: null
        })
      );
    }
  )
];
