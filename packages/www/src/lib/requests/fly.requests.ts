import { env } from '$env/dynamic/private';
import { adjectives, names, uniqueNamesGenerator } from 'unique-names-generator';

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
		dictionaries: [adjectives, adjectives, NAMES_DICTIONARY],
		separator: '-'
	});

	return `${randomName}-${Date.now()}`;
}

export async function createFlyAppRequest(maxAttempts: number = 5, delayMs: number = 1000) {
	let attempt = 0;
	let lastError: any;
	const data = {
		app_name: '',
		org_slug: 'capsules-801'
	};
	const url = `${FLY_API_HOSTNAME}/v1/apps`;

	while (attempt < maxAttempts) {
		try {
			data.app_name = generateUniqueFlyAppName();
			console.log(`Attempt ${attempt + 1}: Trying with name: ${data.app_name}`);

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
				return { appName: data.app_name, result: result };
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

export const createFlyMachinesForFlyAppRequest = async (
	appName: string,
	owner_password: string,
	owner_email: string
) => {
	const data = {
		name: appName,
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
				OWNER_PASSWORD: owner_password,
				OWNER_EMAIL: owner_email,
				JWT_SECRET: generateSecureSecret(),
				JWT_REFRESH_SECRET: generateSecureSecret(),
				IS_CLOUD_PROVIDED: 'true',
				CLOUD_CAPSULE_CALLBACK_URL: 'https://capsule.sh/api/callback'
				// BASE_URL=http://localhost:3000/api/v1
			},
			services: [
				{
					ports: [
						{
							port: 443,
							handlers: ['tls', 'http']
						},
						{
							port: 80,
							handlers: ['http']
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

export const creeateVolumeForFlyApp = async (appName: string) => {
	const url = `${FLY_API_HOSTNAME}/v1/apps/${appName}/volumes`;
	const volumeName = fromAppNameToVolumeName(appName);
	console.log(volumeName);
	const data = {
		name: volumeName,
		region: 'cdg',
		size_gb: 10
	};
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${env.FLY_API_TOKEN}`
		},
		body: JSON.stringify(data)
	});
	const result = await response.json();
	if (result.errors) {
		throw new Error(`Error creating volume: ${result.errors[0].message}`);
	}
	console.log(result);

	return result.data;
};

export const emmitSslCertificatesForFlyAppRequest = () => {};
const fromAppNameToVolumeName = (appName: string) =>
	appName
		.toLowerCase()
		.replace(/[^a-z0-9_]/g, '_')
		.replace(/_+/g, '_')
		.replace(/^_|_$/g, '')
		.split('_')
		.slice(0, 1)
		.join('_') +
	'_' +
	Date.now() +
	'_vol';

function generateSecureSecret(length: number = 64, includeSpecialChars: boolean = true): string {
	const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const lowercase = 'abcdefghijklmnopqrstuvwxyz';
	const numbers = '0123456789';
	const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

	let chars = uppercase + lowercase + numbers;
	if (includeSpecialChars) {
		chars += special;
	}

	const cryptoArray = new Uint8Array(length);
	crypto.getRandomValues(cryptoArray);

	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars[cryptoArray[i] % chars.length];
	}

	return result;
}
