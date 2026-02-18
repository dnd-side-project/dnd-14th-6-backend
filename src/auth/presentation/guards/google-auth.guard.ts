import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { AuthRequest } from '../types/auth.type';
import { encodeOAuthState } from '../utils/oauth-state.util';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request & AuthRequest>();
    const stateObj = {
      redirectUrl: request.query.redirectUrl ?? '/',
      gameSessionId: request.query.gameSessionId,
    };

    return { state: encodeOAuthState(stateObj) };
  }
}
