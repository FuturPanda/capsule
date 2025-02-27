import { env } from '$env/dynamic/private';
import Redis from 'ioredis';

export const POST = async ({ request }: { request: Request }) => {
	const response: { email: string; apiKey: string } = await request.json();
	const redis = new Redis(env.REDIS_URL);
	await redis.set(`${response.email}::apiKey`, `${response.apiKey}`);
	await redis.quit();
	return new Response(null, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain'
		}
	});
};

export const GET = async ({ url }) => {
	const token = url.searchParams.get('token');
	const redis = new Redis(env.REDIS_URL);
	const email = await redis.get(`${token}::email`);
	const apiKey = await redis.get(`${email}::apiKey`);
	await redis.quit();
	if (apiKey === null || apiKey === '') {
		const data = { error: 'Error while retreiving API Key' };
		return new Response(JSON.stringify(data), {
			status: 400,
			headers: {
				'Content-Type': 'text/plain'
			}
		});
	} else {
		const data = { apiKey: apiKey };
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: {
				'Content-Type': 'text/plain'
			}
		});
	}
};
