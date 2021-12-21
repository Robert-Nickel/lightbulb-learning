import { initAmplify } from '$lib/awsCommon';
import type { CognitoUser } from '@aws-amplify/auth';
import { Auth } from 'aws-amplify';
import { writable } from 'svelte/store';

export type User = CognitoUser & { id: string };

export const user = writable(null as User | undefined);

initAmplify();

Auth.currentAuthenticatedUser().then((x) => {
	user.set({ ...x, id: x.attributes.sub });
});
