import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AuthorizedRequest } from '../types/authorized-request';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class UpdateCurrentUserInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<AuthorizedRequest>();

    return next.handle().pipe(
      map((data: User) => {
        request.user = data;
        return data;
      }),
    );
  }
}
