import cookie from 'cookie';
import { v4 as uuid } from '@lukeed/uuid';
import { compute_rest_props } from 'svelte/internal';

import { Amplify, withSSRContext } from 'aws-amplify';

// export const handle = async ({ request, resolve }) => {
//   console.log('inside hooks handle', request);
//   const cookies = cookie.parse(request.headers.cookie || '');
//   console.log('🥴 🥴 🥴 🥴', { cookies });
//   // request.locals.userid = cookies.userid || uuid();
//   request.locals.userid = cookies.userid;

//   // TODO https://github.com/sveltejs/kit/issues/1046
//   if (request.query.has('_method')) {
//     request.method = request.query.get('_method').toUpperCase();
//   }

//   const response = await resolve(request);

//   if (!cookies.userid) {
//     // if this is the first time the user has visited this app,
//     // set a cookie so that we recognise them when they return
//     response.headers[
//       'set-cookie'
//     ] = `userid=${request.locals.userid}; Path=/; HttpOnly`;
//   }

//   return response;
// };

export const getSession = ({ headers: { cookie } }) => {
  return {
    req: { headers: { cookie } },
  };
};

export async function handle({ request, resolve }) {
  const cookies = cookie.parse(request.headers?.cookie || '');

  if (typeof cookies === 'object' && cookies !== null) {
    for (const ck in cookies) {
      if (Object.hasOwnProperty.call(cookies, ck)) {
        const element = cookies[ck];
        request.locals[ck] = element ? element : null;
        request.headers[ck] = element ? element : null;
      }
    }
  }

  const response = await resolve(request);

  return {
    ...response,
    headers: {
      ...response.headers,
      ...request.headers,
      'x-custom-header': 'potato 2',
    },
  };
}
