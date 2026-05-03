import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  HttpCode,
  Request,
} from '@nestjs/common';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from '../common/guards/local.guard';
import { User } from '../users/entities/user.entity';
import { HashService } from '../hashing/hash.service';
import { UsersService } from '../users/users.service';
import { AuthorizedRequest } from '../common/types/authorized-request';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly hashService: HashService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @HttpCode(200)
  @Post('signin')
  signin(@Request() req: AuthorizedRequest) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    return this.authService.auth(req.user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user: User = await this.usersService.create(createUserDto);
    return user;
  }
}
