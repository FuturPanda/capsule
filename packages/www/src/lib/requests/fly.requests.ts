import { env } from '$env/dynamic/private';
import { adjectives, names, uniqueNamesGenerator } from 'unique-names-generator';
import { v4 as uuidv4 } from 'uuid';

const FLY_API_HOSTNAME = 'https://api.machines.dev';
const FLY_GRAPHQL_HOSTNAME = 'https://api.fly.io/graphql';

const NAMES_DICTIONARY: string[] = names.map((name) => name.toLowerCase());
const NAME_ALREADY_EXISTS_ERROR = 'Validation failed: Name has already been taken';

export type ResponseCapsuleCreationDto = {
	id: string;
	created_at: string;
	error?: string;
};

function generateUniqueFlyAppName(): string {
	const randomName = uniqueNamesGenerator({
		dictionaries: [adjectives, adjectives, NAMES_DICTIONARY, NAMES_DICTIONARY],
		separator: '-'
	});

	return `${randomName}-${uuidv4()}`;
}

export async function createFlyAppRequest(maxAttempts: number = 5, delayMs: number = 1000) {
	let attempt = 0;
	let lastError: any;
	const data = {
		app_name: 'comfortable-objective-valentia-dyna-579e9aaa-ee1a-4d1b-bd77-12388b3eddd5', //generateUniqueFlyAppName(),
		org_slug: 'capsules-801'
	};
	const url = `${FLY_API_HOSTNAME}/v1/apps`;

	while (attempt < maxAttempts) {
		try {
			const name = generateUniqueFlyAppName();
			console.log(`Attempt ${attempt + 1}: Trying with name: ${name}`);

			const response = await fetch(url, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${env.FLY_API_TOKEN}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			const result = await response.json();

			if (!result.err) {
				return { appName: name, result: result };
			}

			if (result.err?.includes(NAME_ALREADY_EXISTS_ERROR)) {
				attempt++;
				lastError = result.err;
				await new Promise((resolve) => setTimeout(resolve, delayMs));
				continue;
			}

			throw new Error(result.err);
		} catch (error) {
			lastError = error;
			if (error?.message?.includes('name already taken')) {
				attempt++;
				await new Promise((resolve) => setTimeout(resolve, delayMs));
				continue;
			}
			break;
		}
	}

	throw new Error(`Failed after ${maxAttempts} attempts. Last error: ${lastError}`);
}

export const allocateIpAddressToFlyAppRequest = async (appName: string) => {
	const makeQuery = (appName: string, type: string) => `
        mutation {
            allocateIpAddress(input: { appId: "${appName}", type: ${type} }) {
                ipAddress {
                    address
                }
            }
        }
    `;

	const makeRequest = async (ipType: string) => {
		const response = await fetch(FLY_GRAPHQL_HOSTNAME, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${env.FLY_API_TOKEN}`
			},
			body: JSON.stringify({ query: makeQuery(appName, ipType) })
		});

		const result = await response.json();

		// GraphQL error handling
		if (result.errors) {
			throw new Error(`GraphQL Error: ${result.errors[0].message}`);
		}

		return result.data;
	};

	console.log('Allocating IPs for app:', appName);

	try {
		const [ipv4Result, ipv6Result] = await Promise.all([makeRequest('v4'), makeRequest('v6')]);

		return {
			ipv4: ipv4Result?.allocateIpAddress?.ipAddress?.address,
			ipv6: ipv6Result?.allocateIpAddress?.ipAddress?.address
		};
	} catch (error) {
		console.error('Error allocating IP addresses:', error);
		throw error;
	}
};

export const createFlyMachinesForFlyAppRequest = async (appName: string) => {
	const data = {
		config: {
			image: 'docker.io/futurpanda/capsule-back:latest',
			restart: {
				policy: 'always'
			},
			guest: {
				cpu_kind: 'shared',
				cpus: 1,
				memory_mb: 1024
			},
			env: {
				OWNER_PASSWORD: 'Np9-eGTWY6Wt*ac@',
				OWNER_EMAIL: 'sty.hoareau@gmail.com',
				JWT_SECRET: 'x@FLBG2jPMWnE*6vsfERsz.-ctECr!R@kd',
				JWT_REFRESH_SECRET: '!BEJCZ7ijytZk7@@MXePAiwXM2T6Hx'
				// BASE_URL=http://localhost:3000/api/v1
			},
			services: [
				{
					ports: [
						{
							port: 443,
							handlers: ['http'],
							force_https: true
						},
						{
							port: 80,
							handlers: ['http'],
							force_https: true
						}
					],
					protocol: 'tcp',
					internal_port: 3000,
					autostart: true,
					autostop: 'stop'
				}
			]
		}
	};
	const url = `${FLY_API_HOSTNAME}/v1/apps/${appName}/machines`;
	return await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.FLY_API_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
};

export const emmitSslCertificatesForFlyAppRequest = () => {};
