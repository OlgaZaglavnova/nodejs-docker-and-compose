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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtGuard } from '../common/guards/jwt.guard';

// Здесь опечатка, правильный эндпоинты контроллера должен быть @Controller('wishlists')
// Но запросы от фронта тоже идут с wishlistlists, если я тут исправлю, запросы перестанут обрабатываться
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.wishlistsService.create(createWishlistDto, currentUser);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.wishlistsService.update(+id, updateWishlistDto, currentUser);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.wishlistsService.remove(+id, currentUser);
  }
}
