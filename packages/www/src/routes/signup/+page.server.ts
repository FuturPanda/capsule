import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import Redis from 'ioredis';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { v4 as uuidv4 } from 'uuid';
import type { PageServerLoad } from './$types.js';
import { formSchema } from './schema';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions = {
	default: async ({ request, fetch }) => {
		const form = await superValidate(request, zod(formSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const redis = new Redis(env.REDIS_URL);
		const email = await redis.get(`${form.data.email}`);
		// console.log(email);
		// if (email) {
		// 	return { success: false, error: ' Email already used' };
		// }
		const token = form.data['cf-turnstile-response'];
		const cfFormData = new FormData();
		cfFormData.append('secret', '0x4AAAAAAA7oFoC9OTcRpfvUZGKOBacIgYw');
		cfFormData.append('response', token);
		console.log(cfFormData);
		const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
		const result = await fetch(url, { body: cfFormData, method: 'POST' });

		const outcome: { success: boolean } = await result.json();
		if (!outcome.success) error(400, 'Cloudflare challenge was not complete correctly');
		else {
			const uuid = uuidv4();
			await redis.set(`${form.data.email}`, uuid);
			await redis.set(`${uuid}::email`, form.data.email);
			await redis.set(`${uuid}::password`, form.data.password);
			await redis.set(`${uuid}::isConfirmed`, 'false');
			await redis.set(`${uuid}::isCapsuleCreated`, 'false');
			const email = await redis.get(`${uuid}::email`);
			const isConfirmed = await redis.get(`${uuid}::isConfirmed`);
			console.log('From Redis : ', email, isConfirmed);
			await redis.quit();

			const response = await fetch('/api/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ uuid, email: form.data.email })
			});

			if (!response.ok) {
				return { success: false, error: 'Failed to send email', form };
			}
		}

		return { success: true, form };
	}
};
