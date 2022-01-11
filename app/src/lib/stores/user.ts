import { browser } from '$app/env';
import { initAmplify } from '$lib/awsCommon';
import type { CognitoUser } from '@aws-amplify/auth';
import { Auth } from 'aws-amplify';
import { writable } from 'svelte/store';

export type User = CognitoUser & { id: string } & { groupID: string };

export const user = writable(null as User | undefined);

initAmplify();

if (browser) {
	Auth.currentAuthenticatedUser().then((cognitoUser) => {
		user.set({ ...cognitoUser, id: cognitoUser.signInUserSession.getIdToken().payload["cognito:groups"] });
	});
}
