export const routes = {
	root: '/',
	login: '/login',
	logout: '/?logout=true',
	resetPassword: 'type=recovery',
	welcome: '/welcome',
	courses: '/course',
	course: (id: string) => `/course/${id}`,
	courseSettings: (id: string) => `/course/${id}/settings`,
	coursePerformances: (id: string) => `/course/${id}/performances`,
	openQuestion: (id: string) => `/openquestion/${id}`,
	openAnswer: (id: string) => `/openanswer/${id}`,
	performance: (id: string) => `/performance/${id}`,
	evaluateAuth: '/evaluateAuth',
	newCourse: '/new-course',
	joinCourse: (inviteCode: string = "") => `/join-course/${inviteCode}`,
	help: '/help'
};
