import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';
import {
  USER_ABOUT_MAX_LENGTH,
  USER_ABOUT_MIN_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '../../common/constants/constants';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Имя пользователя обязательно' })
  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH)
  username: string;

  @IsEmail({}, { message: 'Некорректный email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MinLength(USER_PASSWORD_MIN_LENGTH, {
    message: 'Пароль должен содержать минимум 2 символа',
  })
  password: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @Length(USER_ABOUT_MIN_LENGTH, USER_ABOUT_MAX_LENGTH)
  about?: string;
}
