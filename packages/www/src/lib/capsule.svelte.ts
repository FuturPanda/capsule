import {
	CapsuleClient,
	createCapsuleClient,
	OAuthScopes,
	type CapsuleConfig
} from '@capsule-mono-repo/capsule-client';

const config: CapsuleConfig = {
	scopes: [OAuthScopes.PROFILE_READ, OAuthScopes.TASKS_READ, OAuthScopes.TASKS_WRITE],
	identifier: 'my-awesome-app-v1.0.3',
	redirectUri: 'https://localhost:3000/'
};

const useCapsuleClient = async (): Promise<CapsuleClient> => {
	try {
		const client = await createCapsuleClient(config);
		return client;
	} catch (error) {
		console.error('Failed to create Capsule client:', error);
		throw error;
	}
};
export default useCapsuleClient;
