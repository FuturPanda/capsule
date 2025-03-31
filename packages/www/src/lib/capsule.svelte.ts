import {
	CapsuleClient,
	createCapsuleClient,
	OAuthScopes,
	type CapsuleConfig
} from '@capsulesh/capsule-client';

const config: CapsuleConfig = {
	scopes: [OAuthScopes.PROFILE_READ, OAuthScopes.TASKS_READ, OAuthScopes.TASKS_WRITE],
	identifier: 'my-awesome-app-v1.0.3',
	redirectUri: 'http://localhost:5173/?yes=yes'
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
