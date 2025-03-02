import { env } from '$env/dynamic/private';
import { Resend } from 'resend';

let resend: Resend;

const generateEmail = (apiKey: string, capsuleUrl: string) =>
	`
<body>
  Your capsule is ready!
  Here is your api key: ${apiKey}.
  You will need this key as well as the URL of your capsule to enter your capsule.
  Here is the URL of your capsule: ${capsuleUrl}
  You can access your capsule at <a href="https://ui.capsule.sh">https://ui.capsule.sh</a>.
</body>
`;

export const POST = async ({ request }: { request: Request }) => {
	const { email, apiKey, capsuleUrl } = await request.json();
	if (resend == null) {
		resend = new Resend(env.RESEND_API_KEY);
	}
	const { data, error } = await resend.emails.send({
		from: 'Capsule <hello@capsule.sh>',
		to: [email],
		subject: 'Your capsule is ready!',
		html: generateEmail(apiKey, capsuleUrl)
	});

	if (error) {
		console.log(error);
	}

	return new Response('response');
};
