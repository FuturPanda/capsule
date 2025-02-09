import type { PageServerLoad } from '../../../../.svelte-kit/types/src/routes/$types';

export const load: PageServerLoad = async () => {
	//TODO :
	// const token = url.searchParams.get('token');
	// const redis = new Redis(6379);
	// const email = await redis.get(`${token}::email`);
	// if (!email) error(404, 'invalid link');
	// const isConfirmed = await redis.get(`${token}::isConfirmed`);
	// if (isConfirmed) error(401, 'The link has already been used');
	// return {
	// 	isConfirmed,
	// 	email
	// };
};

export const actions = {
	default: async () => {}
};
