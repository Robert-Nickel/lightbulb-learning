export const routes = {
	root: '/',
	login: '/login',
	logout: '/?logout=true',
	challengePools: '/challengepool',
	challengePool: (id: string) => `/challengepool/${id}`,
	evaluateAuth: '/evaluateAuth',
	create: '/create',
	join: '/join',
	help: '/help'
};
