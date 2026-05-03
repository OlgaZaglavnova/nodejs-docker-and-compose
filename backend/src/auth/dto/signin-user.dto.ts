import { IsString, Length, MinLength } from 'class-validator';
import {
  USER_PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '../../common/constants/constants';

export class SigninUserDto {
  @IsString()
  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, {
    message: `Имя пользователя должно содержать от ${USERNAME_MIN_LENGTH} до ${USERNAME_MAX_LENGTH} символов`,
  })
  username: string;

  @IsString()
  @MinLength(USER_PASSWORD_MIN_LENGTH, {
    message: `Пароль должен содержать минимум ${USER_PASSWORD_MIN_LENGTH} символа`,
  })
  password: string;
}
