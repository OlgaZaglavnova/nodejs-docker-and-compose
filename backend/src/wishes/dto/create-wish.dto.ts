import { Wish } from '../entities/wish.entity';
import { PickType } from '@nestjs/mapped-types';

const createWishDtoFields: (keyof Wish)[] = [
  'name',
  'link',
  'image',
  'price',
  'description',
];

export class CreateWishDto extends PickType(Wish, createWishDtoFields) {}
