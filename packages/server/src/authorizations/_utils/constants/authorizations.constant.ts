export enum OAuthScopes {
  PROFILE_READ = 'profile:read',
  PROFILE_WRITE = 'profile:write',
  EMAIL_READ = 'email:read',
  EMAIL_WRITE = 'email:write',
  TASKS_READ = 'tasks:read',
  TASKS_WRITE = 'tasks:write',
  EVENTS_READ = 'events:read',
  EVENTS_WRITE = 'events:write',
}

export const OAuthScopeDescriptions: Record<OAuthScopes, string> = {
  [OAuthScopes.PROFILE_READ]: 'View your basic profile information',
  [OAuthScopes.PROFILE_WRITE]: 'Update your profile information',
  [OAuthScopes.TASKS_READ]: 'View your tasks',
  [OAuthScopes.TASKS_WRITE]: 'Create, update, and delete your tasks',
  [OAuthScopes.EVENTS_READ]: 'View your events',
  [OAuthScopes.EVENTS_WRITE]: 'Create, update, and delete your events',
  [OAuthScopes.EMAIL_READ]: 'View your email address',
  [OAuthScopes.EMAIL_WRITE]: 'Update your email address',
};
