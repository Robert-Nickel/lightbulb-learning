import { browser } from '$app/env';
import Amplify from 'aws-amplify';
import aws_exports from '../aws-exports';
import * as process from 'process';

export function initAmplify() {
	if (browser && !window['amplifyIsInitialized']) {
		Amplify.configure(aws_exports);
		window['amplifyIsInitialized'] = true;
		// Based on https://github.com/aws-amplify/amplify-js/issues/3274#issuecomment-497773026
		window['process'] = process;
	}
}

export const baseUrl = 'https://yybkc7efv3.execute-api.eu-central-1.amazonaws.com';
