import { PartialType, PickType } from '@nestjs/mapped-types';

import { Wish } from '../entities/wish.entity';

export const wishPartialFields: (keyof Wish)[] = [
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
];

export class WishPartial extends PartialType(
  PickType(Wish, wishPartialFields),
) {}
