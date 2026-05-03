import {
  Controller,
  Get,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  Patch,
  Post,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateCurrentUserInterceptor } from '../common/interceptors/update-current-user.interceptor';
import {
  UserProfileResponseDto,
  userProfileResponseDtoFields,
} from './dto/user-profile-response.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { findUserDto } from './dto/find-users.dto';
import {
  EntityPickInterceptor,
  PublicFields,
} from '../common/interceptors/entity-pick.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @UseInterceptors(EntityPickInterceptor)
  @PublicFields(...userProfileResponseDtoFields)
  @Get('me')
  getMe(@CurrentUser() user: User): UserProfileResponseDto {
    return user;
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async getMyWishes(@CurrentUser() user: User): Promise<Wish[]> {
    const meWishes = await this.usersService.findMeWishes(user.username);
    return meWishes;
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(UpdateCurrentUserInterceptor)
  @UseInterceptors(EntityPickInterceptor)
  @PublicFields(...userProfileResponseDtoFields)
  @Patch('me')
  async updateMe(@CurrentUser() user: User, @Body() userDto: UpdateUserDto) {
    return await this.usersService.update(user.id, userDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  findUserWishes(@Param('username') username: string) {
    return this.usersService.findUserWishes(username);
  }

  @UseGuards(JwtGuard)
  @Post('find')
  findUsers(@Body() params: findUserDto): Promise<UserProfileResponseDto[]> {
    return this.usersService.findUsersByEmailOrName(params);
  }
}
