import { error } from '@sveltejs/kit';
import type { PageServerLoad } from '../../../../.svelte-kit/types/src/routes/$types';
import Redis from 'ioredis';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	console.log(token);
	const redis = new Redis(6379);
	if (!redis) error(500, 'Redis instance not working');
	const email = await redis.get(`${token}::email`);
	console.log(email);
	if (!email) error(404, 'invalid link');
	const isConfirmed = await redis.get(`${token}::isConfirmed`);
	if (isConfirmed === 'true') error(401, 'The link has already been used');
	return {
		isConfirmed,
		email
	};
};
