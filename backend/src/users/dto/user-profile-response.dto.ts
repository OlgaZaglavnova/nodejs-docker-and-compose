import { User } from '../entities/user.entity';
import { PickType } from '@nestjs/mapped-types';

export const userProfileResponseDtoFields: (keyof User)[] = [
  'id',
  'username',
  'about',
  'avatar',
  'email',
  'createdAt',
  'updatedAt',
];

export class UserProfileResponseDto extends PickType(
  User,
  userProfileResponseDtoFields,
) {}

export const userProfileSelectFields = {
  id: true,
  username: true,
  about: true,
  avatar: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};
