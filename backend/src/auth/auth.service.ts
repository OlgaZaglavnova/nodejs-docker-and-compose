import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { HashService } from '../hashing/hash.service';
import { User } from '../users/entities/user.entity';
import { SigninUserResponseDto } from './dto/signin-user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private hashService: HashService,
  ) {}

  /**
   * Возвращает токен
   * @param user
   * @returns
   */
  auth(user: User): SigninUserResponseDto {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  /**
   * Находит пользователя по username, проверяет пароль
   * возвращает пользователя без поля password
   * @param username
   * @param password
   * @returns
   */
  async validateUser(username: string, password: string) {
    const user = await this.findUserAndCheckPassword(username, password);

    if (user) {
      const { password: _password, ...result } = user;
      return result;
    }

    return null;
  }

  async findUserAndCheckPassword(username: string, password: string) {
    const user = await this.usersService.findByUsernameForAuth(username);

    if (user) {
      const isPasswordValid = await this.hashService.compare(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        return null;
      }

      return user;
    }

    return null;
  }
}
