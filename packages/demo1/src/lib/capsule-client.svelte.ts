import {
	CapsuleClient,
	createCapsuleClient,
	OAuthScopes,
	type CapsuleConfig
} from '@capsule-mono-repo/capsule-client';

const config: CapsuleConfig = {
	scopes: [OAuthScopes.PROFILE_READ, OAuthScopes.TASKS_READ, OAuthScopes.TASKS_WRITE],
	identifier: 'Beautiful Todo',
	redirectUri: 'http://localhost:5173/'
};

let client: CapsuleClient | null = $state(null);

const useCapsuleClient = () => {
	try {
		if (!client) {
			console.log('Creating Capsule client');
			client = createCapsuleClient(config);
		}
		return client;
	} catch (error) {
		console.error('Failed to create Capsule client:', error);
		throw error;
	}
};
export default useCapsuleClient;
