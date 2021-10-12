import App from './App.svelte';

// import * as amplify from 'aws-amplify/dist/aws-amplify.min.js'

import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import aws_exports from './aws-exports';

// in this way you are only importing Auth and configuring it.
Amplify.configure(aws_exports);
// Auth.configure(aws_exports);

const app = new App({
  target: document.getElementById('app')
})

export default app
