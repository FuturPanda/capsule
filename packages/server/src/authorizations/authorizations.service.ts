import { OAuthScopes } from '@capsulesh/shared-types';
import { Injectable } from '@nestjs/common';
import { OAuthScopeDescriptions } from './_utils/constants/authorizations.constant';

@Injectable()
export class AuthorizationsService {
  getScopeDisplayInfo(
    scopesString: string,
  ): Array<{ name: string; description: string }> {
    const requestedScopes = scopesString.split(',');

    return requestedScopes.map((scope) => {
      if (Object.values(OAuthScopes).includes(scope as OAuthScopes)) {
        return {
          name: this.formatScopeName(scope),
          description: OAuthScopeDescriptions[scope as OAuthScopes],
        };
      } else {
        return {
          name: this.formatScopeName(scope),
          description: 'Access to additional features',
        };
      }
    });
  }

  formatScopeName(scope: string): string {
    return scope
      .replace(':', ' ')
      .replace('_', ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
