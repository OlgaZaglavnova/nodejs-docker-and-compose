import { PickType } from '@nestjs/mapped-types';

import { Wish } from '../entities/wish.entity';

export const usersWishFields: (keyof Wish)[] = [
  'id',
  'createdAt',
  'updatedAt',
  'name',
  'link',
  'image',
  'price',
  'raised',
  'copied',
  'description',
  'offers',
];

export class UsersWish extends PickType(Wish, usersWishFields) {}
