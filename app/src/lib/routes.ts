export const routes = {
	root: '/',
	login: '/login',
	courses: '/course',
	course: (id: string) => `/course/${id}`,
	courseSettings: (id: string) => `/course/${id}/settings`,
	coursePerformances: (id: string) => `/course/${id}/performances`,
	question: (id: string) => `/question/${id}`,
	answer: (id: string) => `/answer/${id}`,
	performance: (id: string) => `/performance/${id}`,
	certificate: (id: string) => `/certificate/${id}`,
	newCourse: '/new-course',
	joinCourse: (inviteCode: string = "") => `/join-course/${inviteCode}`,
	help: '/help'
};
