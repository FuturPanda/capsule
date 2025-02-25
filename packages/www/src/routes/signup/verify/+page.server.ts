import { error } from '@sveltejs/kit';
import Redis from 'ioredis';
import type { PageServerLoad } from '../$types';

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
	await redis.set(`${token}::isConfirmed`, 'true');
	await redis.set(`${token}::capsule`, 'false');
	return {
		isConfirmed,
		email,
		token
	};
};
