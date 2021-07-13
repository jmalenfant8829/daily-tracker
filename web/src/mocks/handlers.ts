// mock handlers for mock-service-worker

import { rest } from 'msw';

// 'existing' users
const users = [{ username: 'gordin', password: 'but-maars' }];
// sample auth token
export const testToken = 'my-secret-token';

// creates api url
const backendPath = (path: string) => {
  return process.env.REACT_APP_BACKEND_API + path;
};

export const handlers = [
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
  })
];
