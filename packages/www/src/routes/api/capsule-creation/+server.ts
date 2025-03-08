import { env } from '$env/dynamic/private';
import {
	allocateIpAddressToFlyAppRequest,
	createFlyAppRequest,
	createFlyMachinesForFlyAppRequest,
	creeateVolumeForFlyApp,
	type ResponseCapsuleCreationDto
} from '$lib/requests/fly.requests';
import { error } from '@sveltejs/kit';
import Redis from 'ioredis';
import { produce } from 'sveltekit-sse';
type CreateCapsuleRequestDto = {
	appName: string;
	result: ResponseCapsuleCreationDto;
};

export const POST = async ({ url }) => {
	const params = url.searchParams;
	if (!params.has('token')) error(404, 'Unauthorized');
	const token = params.get('token');
	return produce(async function start({ emit }) {
		const redis = new Redis(env.REDIS_URL);
		try {
			console.log('BEFORE FIRST REQUEST');
			emit('message', JSON.stringify({ content: 'Creating capsule...', progress: 0 }));
			const res1: CreateCapsuleRequestDto = await createFlyAppRequest();
			const appName = res1.appName;
			console.log(appName);
			emit(
				'message',
				JSON.stringify({ content: `Capsule created with name ${appName}`, progress: 20 })
			);
			emit('message', JSON.stringify({ content: `Allocating IP address...`, progress: 25 }));

			const res2 = await allocateIpAddressToFlyAppRequest(appName);
			console.log(res2);
			emit('message', JSON.stringify({ content: `IP address allocated`, progress: 45 }));
			emit('message', JSON.stringify({ content: `Creating physical instance...`, progress: 50 }));
			const email = await redis.get(`${token}::email`);
			const password = await redis.get(`${token}::password`);
			if (!email || !password) {
				emit('message', JSON.stringify({ content: `Email or password not found`, progress: 100 }));
				return;
			}
			const res3 = await creeateVolumeForFlyApp(appName);
			console.log(res3);
			emit('message', JSON.stringify({ content: `Physical instance created`, progress: 70 }));
			emit('message', JSON.stringify({ content: `Mounting volumes ...`, progress: 75 }));
			const res4 = await createFlyMachinesForFlyAppRequest(appName, email, password, res3.id);
			await res4.json();
			emit('message', JSON.stringify({ content: `Volume Mounted`, progress: 85 }));
			emit('message', JSON.stringify({ content: `Done. Your Capsule is ready`, progress: 90 }));
			console.log('BEFORE SECOND REQUEST');
		} catch (error) {
			console.error(error);
		}
		redis.set(`${token}::isCapsuleCreated`, 'true');
		emit('message', JSON.stringify({ content: `Redirecting to capsule dashboard`, progress: 98 }));
		emit('message', JSON.stringify({ content: `END`, progress: 100 }));
	});
};
