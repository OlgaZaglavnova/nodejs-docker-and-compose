import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { AuthorizedRequest } from '../types/authorized-request';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User | null => {
    const request = ctx.switchToHttp().getRequest<AuthorizedRequest>();
    return request.user ?? null;
  },
);
