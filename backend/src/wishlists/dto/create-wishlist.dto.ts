import { PickType } from '@nestjs/mapped-types';
import { Wishlist } from '../entities/wishlist.entity';

const createWishlistDtoFields: (keyof Wishlist)[] = ['name', 'image'];

export class CreateWishlistDto extends PickType(
  Wishlist,
  createWishlistDtoFields,
) {
  itemsId: number[];
}
