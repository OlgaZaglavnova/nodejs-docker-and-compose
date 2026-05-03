import { IsNotEmpty } from 'class-validator';

export class SigninUserResponseDto {
  @IsNotEmpty({ message: 'Пустой jwt-token' })
  access_token: string;
}
