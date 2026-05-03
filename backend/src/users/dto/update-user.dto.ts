import { PartialType, PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export const updateUserDtoFields: (keyof User)[] = [
  'username',
  'about',
  'avatar',
  'email',
  'password',
];

export class UpdateUserDto extends PartialType(
  PickType(User, updateUserDtoFields),
) {}
