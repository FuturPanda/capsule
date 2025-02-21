import { REDIS_URL } from '$env/static/private';
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
		console.log('Form Action ');
		const form = await superValidate(request, zod(formSchema));
		console.log(form);
		console.log('IN server page ');
		if (!form.valid) {
			return fail(400, { form });
		}
		const token = form.data['cf-turnstile-response'];
		const cfFormData = new FormData();
		cfFormData.append('secret', '0x4AAAAAAA7oFoC9OTcRpfvUZGKOBacIgYw');
		cfFormData.append('response', token);
		const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
		const result = await fetch(url, { body: cfFormData, method: 'POST' });

		const outcome: { success: boolean } = await result.json();
		console.log('Blabla outcome', outcome);
		if (!outcome.success) error(400, 'Cloudflare challenge was not complete correctly');
		else {
			const uuid = uuidv4();
			const redis = new Redis(REDIS_URL);
			await redis.set(`${uuid}::email`, form.data.email);
			await redis.set(`${uuid}::password`, form.data.password);
			await redis.set(`${uuid}::isConfirmed`, 'false');
			const email = await redis.get(`${uuid}::email`);
			const isConfirmed = await redis.get(`${uuid}::isConfirmed`);
			console.log('From Redis : ', email, isConfirmed);

			const response = await fetch('/api/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ uuid })
			});

			if (!response.ok) {
				return { success: false, error: 'Failed to send email' };
			}
		}

		return { success: true, form };
	}
};
