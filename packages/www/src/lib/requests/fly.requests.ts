export const createFlyAppRequest = async () => {
	const body: createFlyAppDto = {
		app_name: 'capsule-of-ziguigui2eeee',
		org_slug: 'personal',
		network: 'my-optional-network'
	};
	const response = await requestFlyApi('apps', 'POST', body);
	console.log(response);
	return response;
};

export type createFlyAppDto = {
	app_name: string;
	org_slug: string;
	network: string;
};

export const allocateFlyIpsRequest = () => {};
export const createFlyMachineRequest = () => {};

export const requestFlyApi = (
	endpoint: string,
	method: 'POST' | 'GET',
	query: createFlyAppDto,
	variables?: unknown
) =>
	fetch(`${FLY_API_HOSTNAME}/${endpoint}`, {
		method: method,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${import.meta.env.VITE_FLY_TOKEN}`
		},
		body: JSON.stringify(query)
	});

const FLY_API_HOSTNAME = 'https://api.machines.dev/v1';
const FLY_GRAPHQL_API_HOSTNAME = 'https://api.fly.io/graphql';
