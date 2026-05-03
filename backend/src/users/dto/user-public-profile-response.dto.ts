import { User } from '../entities/user.entity';
import { PickType } from '@nestjs/mapped-types';

export const userPublicProfileResponseDtoFields: (keyof User)[] = [
  'id',
  'username',
  'about',
  'avatar',
  'createdAt',
  'updatedAt',
];

export class UserPublicProfileResponseDto extends PickType(
  User,
  userPublicProfileResponseDtoFields,
) {}

export const userPublicProfileSelectFields = {
  id: true,
  username: true,
  about: true,
  avatar: true,
  createdAt: true,
  updatedAt: true,
};
