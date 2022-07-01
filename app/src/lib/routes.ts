export const routes = {
	root: '/',
	login: '/login',
	logout: '/?logout=true',
	welcome: '/welcome',
	courses: '/course',
	course: (id: string) => `/course/${id}`,
	courseSettings: (id: string) => `/course/${id}/settings`,
	coursePerformances: (id: string) => `/course/${id}/performances`,
	question: (id: string) => `/question/${id}`,
	answer: (id: string) => `/answer/${id}`,
	performance: (id: string) => `/performance/${id}`,
	newCourse: '/new-course',
	joinCourse: (inviteCode: string = "") => `/join-course/${inviteCode}`,
	help: '/help'
};
