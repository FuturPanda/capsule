import { type ResponseCapsuleCreationDto } from '$lib/requests/fly.requests';
import type { RequestHandler } from '@sveltejs/kit';
import { produce } from 'sveltekit-sse';

type CreateCapsuleRequestDto = {
	appName: string;
	result: ResponseCapsuleCreationDto;
};

export const POST: RequestHandler = async () => {
	return produce(async function start({ emit }) {
		try {
			console.log('BEFORE FIRST REQUEST');
			emit('message', 'Creating capsule...');
			// const res1: CreateCapsuleRequestDto = await createFlyAppRequest();
			const appName = 'single-actual-zuzana-thalia-a3fc20f5-f8a7-422b-bfdf-da734c2d86b1'; //res1.appName;
			console.log(appName);
			emit('message', 'Capsule created with name ... ');
			emit('message', 'Allocating IP address...');
			// const res2 = await allocateIpAddressToFlyAppRequest(appName);
			// console.log(res2);

			emit('message', 'IP address allocated');
			emit('message', 'Creating physical instance...');

			// const res3 = await createFlyMachinesForFlyAppRequest(appName);
			// const result = await res3.json();
			emit('message', 'Physical instance created');
			emit('message', 'Emitting Security Certificates');
			emit('message', 'Done. Your Capsule is ready');
			emit('message', 'Redirecting to capsule dashboard');

			console.log('BEFORE SECOND REQUEST');
		} catch (error) {
			console.error(error);
		}
		// console.log('AFTER SECOND REQUEST');
		// emit('message', await res2[0].json());
		// emit('message', await res2[1].json());
	});
};
