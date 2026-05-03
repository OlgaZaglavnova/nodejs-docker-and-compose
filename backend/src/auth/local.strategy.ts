import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from './auth.service';
import { WRONG_USER_PASSWORD_MESSAGE } from '../common/constants/messages';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException(WRONG_USER_PASSWORD_MESSAGE);
    }

    return user;
  }
}
