export const routes = {
	root: '/',
	login: '/login',
	logout: '/?logout=true',
	welcome: '/welcome',
	challengePools: '/challengepool',
	challengePool: (id: string) => `/challengepool/${id}`,
	openQuestion: (id: string) => `/openquestion/${id}`,
	openAnswer: (id: string) => `/openanswer/${id}`,
	performance: (id: string) => `/performance/${id}`,
	evaluateAuth: '/evaluateAuth',
	create: '/create',
	join: '/join',
	help: '/help'
};
