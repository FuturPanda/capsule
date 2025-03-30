import {
	CapsuleClient,
	createCapsuleClient,
	OAuthScopes,
	type CapsuleConfig
} from '@capsulesh/capsule-client';

const config: CapsuleConfig = {
	scopes: [
		OAuthScopes.PROFILE_READ,
		OAuthScopes.TASKS_READ,
		OAuthScopes.TASKS_WRITE,
		OAuthScopes.EVENTS_READ,
		OAuthScopes.EVENTS_WRITE
	],

	identifier: 'Beautiful Calendar',
	redirectUri: 'http://localhost:5174/'
};

let client: CapsuleClient | null = $state(null);

const useCapsuleClient = () => {
	try {
		if (!client) {
			client = createCapsuleClient(config);
		}
		return client;
	} catch (error) {
		console.error('Failed to create Capsule client:', error);
		throw error;
	}
};
export default useCapsuleClient;
