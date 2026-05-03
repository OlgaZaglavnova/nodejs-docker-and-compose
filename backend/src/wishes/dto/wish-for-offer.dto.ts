import { PickType } from '@nestjs/mapped-types';

import { Wish } from '../entities/wish.entity';

export const wishForOfferFields: (keyof Wish)[] = [
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
  'owner',
  'offers',
];

export class WishForOffer extends PickType(Wish, wishForOfferFields) {}
