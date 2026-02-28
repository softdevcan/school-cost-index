/**
 * Route paths - single source of truth for navigation
 */
export const ROUTES = {
	HOME: '/',
	SEARCH: '/search',
	SUBMIT: '/submit',
	UPDATE: '/update',
	SCHOOL: (id: string) => `/school/${id}`,
} as const
