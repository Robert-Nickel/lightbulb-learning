import App from './App.svelte';
import Amplify from '@aws-amplify/core';
// import aws_exports from './aws-exports';
import * as process from 'process';
const aws_exports = require('./aws-exports').default;

Amplify.configure(aws_exports);

// This fix is based on https://github.com/aws-amplify/amplify-js/issues/3274#issuecomment-497773026
window['process'] = process;

const app = new App({
	target: document.body
});

export default app;

// changed myApp6 image from default Amazon EC2 to Node 17.1.0