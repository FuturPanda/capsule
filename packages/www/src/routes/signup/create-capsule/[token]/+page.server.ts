import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import Redis from 'ioredis';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ params }) => {
	const { token } = params;
	const redis = new Redis(env.REDIS_URL);
	if (!redis) error(500, 'Redis instance not working');
	const email = await redis.get(`${token}::email`);
	if (!email) error(404, 'invalid link');
	const isConfirmed = await redis.get(`${token}::isConfirmed`);
	if (isConfirmed === 'false') error(401, 'Your account is not verified');
	const isCapsuleCreated = await redis.get(`${token}::isCapsuleCreated`);
	if (isCapsuleCreated === 'true') error(403, 'Capsule already created');
	await redis.quit();
	return {
		email,
		token
	};
};
