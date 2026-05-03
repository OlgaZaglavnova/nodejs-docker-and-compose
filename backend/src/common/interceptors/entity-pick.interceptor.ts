import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { User } from '../../users/entities/user.entity';
import { Reflector } from '@nestjs/core';
// import { AuthorizedRequest } from '../../common/types/authorized-request';
import { getEntityPartial } from '../helpers/entity-partial.helper';
import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

// Декоратор для настройки интерсептора
export const PublicFields = (...fields: string[]) =>
  SetMetadata('public_fields', fields);

type EntityPickDataType = User | Offer | Wish | Wishlist;

@Injectable()
export class EntityPickInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // const request = context.switchToHttp().getRequest<AuthorizedRequest>();
    // const currentUser = request.user;

    const publicFields = this.reflector.get<(keyof EntityPickDataType)[]>(
      'public_fields',
      context.getHandler(),
    ) || ['id']; // поля по умолчанию

    return next.handle().pipe(
      map((data: EntityPickDataType | EntityPickDataType[] | null) => {
        if (!data) return data;

        // Если массив User-ов
        if (Array.isArray(data)) {
          return data.map((item: User) =>
            this.convertEntity(item, publicFields),
          );
        }

        // Если один user
        return this.convertEntity(data, publicFields);
      }),
    );
  }

  convertEntity(
    entity: EntityPickDataType,
    publicFields: (keyof EntityPickDataType)[],
  ): Partial<EntityPickDataType> {
    if (!entity || !entity.id) return entity;
    return getEntityPartial(entity, publicFields);
  }
}
