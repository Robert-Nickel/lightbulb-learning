import { writable, get } from 'svelte/store';
import Auth from '@aws-amplify/auth'

let _user = localStorage.getItem('amplifyUser');

export const store = writable(_user ? JSON.parse(_user) : null);

store.subscribe((value) => {
  if (value) localStorage.setItem('amplifyUser', JSON.stringify(value));
  else localStorage.removeItem('amplifyUser'); // for logout
});
export const logout = () => store.set(null);
export const loginFormState = writable({
  email: '',
  password: '',
  confirmCode: null,
  confirmingUser: null
});
export async function signIn() {
  return Auth.signIn(
    get(loginFormState).email,
    get(loginFormState).password
  ).then((data) => void store.set(data));
}
export async function signUp() {
  const email = get(loginFormState).email
  return Auth.signUp({
    username: email,
    password: get(loginFormState).password,
    attributes: {
      email: email
    }
  }).then((user) => {
    get(loginFormState).confirmingUser = user;
  });
}
export async function confirmSignUp() {
  if (!get(loginFormState).confirmingUser) {
    console.error({ loginFormState: get(loginFormState) });
    throw new Error('you should be confirming signup right after a signup');
  }

  return Auth.confirmSignUp(
    get(loginFormState).email,
    get(loginFormState).confirmCode
  ).then((_) => {
    store.set(get(loginFormState).confirmingUser);
    get(loginFormState).confirmingUser = null;
  });
}
