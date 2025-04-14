import { Controller, Sse } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import {
  ScopesAndClientIdentifier,
  ScopesAndClientIdentifierType,
} from 'src/_utils/decorators/scopes.decorator';
import { ChiselMessage, ReactivityService } from './reactivity.service';

@Controller('reactivity')
@ApiTags('Reactivity')
export class ReactivityController {
  constructor(private readonly reactivityService: ReactivityService) {}

  @Sse('events')
  events(
    @ScopesAndClientIdentifier()
    { clientIdentifier, scopes }: ScopesAndClientIdentifierType,
  ): Observable<ChiselMessage> {
    return this.reactivityService.getSseConnectionObservable(
      clientIdentifier,
      scopes,
    );
  }
}
