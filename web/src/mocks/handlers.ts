// mock handlers for mock-service-worker

import { rest, ResponseComposition, RestContext } from 'msw';

// 'existing' users
const users = [{ username: 'gordin', password: 'but-maars' }];
// sample auth token
export const testToken = 'my-secret-token';

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
      message: null
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
      const date1 = new Date(year, month - 1, day + 1);
      const date2 = new Date(year, month - 1, day + 2);
      const workTimeData = {
        task1: [{ date: date1.toISOString().split('T')[0], minutes_spent: 20 }],
        task2: [{ date: date2.toISOString().split('T')[0], minutes_spent: 40 }]
      };

      return res(
        ctx.status(200),
        ctx.json({
          status: 'success',
          data: workTimeData,
          message: null
        })
      );
    }
  )
];
