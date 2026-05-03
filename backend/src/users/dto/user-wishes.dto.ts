import { PickType } from '@nestjs/mapped-types';

import { Wish } from '../../wishes/entities/wish.entity';
import { userProfileSelectFields } from './user-profile-response.dto';
import { userPublicProfileSelectFields } from './user-public-profile-response.dto';
import { fullOfferSelectFields } from '../../offers/dto/full-offer.dto';

export const userWishesDtoFields: (keyof Wish)[] = [
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

export class UserWishesDto extends PickType(Wish, userWishesDtoFields) {}

export const meWishSelectFields = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  link: true,
  image: true,
  price: true,
  raised: true,
  copied: true,
  description: true,
  owner: userPublicProfileSelectFields,
  offers: fullOfferSelectFields,
};

export const meWishesSelectFields = {
  ...userProfileSelectFields,
  wishes: meWishSelectFields,
};

export const userWishSelectFields = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  link: true,
  image: true,
  price: true,
  raised: true,
  copied: true,
  description: true,
  offers: true,
};

export const userWishesSelectFields = {
  ...userProfileSelectFields,
  wishes: userWishSelectFields,
};
