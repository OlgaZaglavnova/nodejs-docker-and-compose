import { IsNotEmpty } from 'class-validator';

export class findUserDto {
  @IsNotEmpty({ message: 'Поле query обязательно' })
  query: string;
}
