import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('/last')
  async getLast() {
    return this.wishesService.getLast();
  }

  @Get('/top')
  async getTop() {
    return this.wishesService.getTop();
  }

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createWishDto: CreateWishDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.wishesService.create(createWishDto, currentUser);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.wishesService.copy(+id, currentUser);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @CurrentUser() user: User,
  ) {
    return this.wishesService.update(+id, updateWishDto, user);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.wishesService.remove(+id, currentUser);
  }
}
