import Redis from 'ioredis';

export const POST = async ({ request }: { request: Request }) => {
	const response: { email: string; apiKey: string } = await request.json();
	const redis = new Redis();
	await redis.set(`${response.email}::apiKey`, `${response.apiKey}`);
	await redis.quit();
	return new Response('Hello World!', {
		status: 200,
		headers: {
			'Content-Type': 'text/plain'
		}
	});
};

export const GET = async ({ url }) => {
	const token = url.searchParams.get('token');
	const redis = new Redis();
	const email = await redis.get(`${token}::email`);
	const apiKey = await redis.get(`${email}::apiKey`);
	await redis.quit();
	return new Response(apiKey, {
		status: 200,
		headers: {
			'Content-Type': 'text/plain'
		}
	});
};
