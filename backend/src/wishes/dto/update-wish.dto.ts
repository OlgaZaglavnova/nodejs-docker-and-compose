import { PartialType, PickType } from '@nestjs/mapped-types';

import { Wish } from '../entities/wish.entity';

const updateWishDtoFields: (keyof Wish)[] = [
  'name',
  'link',
  'image',
  'price',
  'description',
];

export class UpdateWishDto extends PartialType(
  PickType(Wish, updateWishDtoFields),
) {}
