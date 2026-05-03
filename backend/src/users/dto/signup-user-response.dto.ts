import { User } from '../entities/user.entity';
import { PickType } from '@nestjs/mapped-types';

export const signupUserResponseDtoFields: (keyof User)[] = [
  'id',
  'username',
  'about',
  'avatar',
  'email',
  'createdAt',
  'updatedAt',
];

export class SignupUserResponseDto extends PickType(
  User,
  signupUserResponseDtoFields,
) {}
