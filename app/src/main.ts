import App from './App.svelte';
import Amplify from '@aws-amplify/core';
import aws_exports from './aws-exports';

Amplify.configure(aws_exports);

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;