import { z } from 'zod';

export const formSchema = z
	.object({
		email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'It must be a valid email' }),
		password: z.string().min(2).max(50),
		'cf-turnstile-response': z.any()
	})
	.superRefine(({ password }, ctx) => {
		const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
		const containsLowercase = (ch: string) => /[a-z]/.test(ch);
		const containsSpecialChar = (ch: string) => /[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~ ]/.test(ch);

		let countOfUpperCase = 0,
			countOfLowerCase = 0,
			countOfNumbers = 0,
			countOfSpecialChar = 0;

		for (let i = 0; i < password.length; i++) {
			const ch = password.charAt(i);
			if (!isNaN(+ch)) countOfNumbers++;
			else if (containsUppercase(ch)) countOfUpperCase++;
			else if (containsLowercase(ch)) countOfLowerCase++;
			else if (containsSpecialChar(ch)) countOfSpecialChar++;
		}

		if (
			countOfLowerCase < 1 ||
			countOfUpperCase < 1 ||
			countOfSpecialChar < 1 ||
			countOfNumbers < 1
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password must be strong',
				path: ['password']
			});
		}
	});

export type FormSchema = typeof formSchema;
