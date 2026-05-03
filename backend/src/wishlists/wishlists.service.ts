import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';
import { selectWishlistFields } from './dto/select-wishlist.dto';
import { getEntityPartial } from '../common/helpers/entity-partial.helper';
import { userPublicProfileResponseDtoFields } from '../users/dto/user-public-profile-response.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  create(createWishlistDto: CreateWishlistDto, currentUser: User) {
    return this.wishesService
      .findWishesForWishlistByIds(createWishlistDto.itemsId)
      .then((items) => {
        // Создаем экземпляр Wishlist
        const wishlist = {
          name: createWishlistDto.name,
          image: createWishlistDto.image,
          items,
          owner: currentUser,
        };
        return this.wishlistRepository.create(wishlist);
      })
      .then((createdWishlist) => {
        return this.wishlistRepository.save(createdWishlist);
      })
      .then((createdWishlist) => {
        // owner - выдадим только разрешенные поля
        const selectedOwner = getEntityPartial(
          createdWishlist.owner,
          userPublicProfileResponseDtoFields,
        );
        return {
          ...createdWishlist,
          owner: selectedOwner,
        };
      });
  }

  findAll() {
    return this.wishlistRepository.find({
      relations: ['owner', 'items'],
      select: selectWishlistFields,
    });
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
      select: selectWishlistFields,
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    currentUser: User,
  ) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist || !wishlist.id) {
      throw new NotFoundException();
    }

    if (wishlist.owner?.id !== currentUser?.id)
      throw new ForbiddenException('Нельзя редактировать чужие коллекции');

    const { itemsId, ...updateWishlist } = updateWishlistDto; // itemsId будем отдельно менять

    Object.assign(wishlist, updateWishlist);

    if (itemsId !== undefined) {
      wishlist.items =
        await this.wishesService.findWishesForWishlistByIds(itemsId);
    }
    return this.wishlistRepository.save(wishlist).then((updatedWishlist) => {
      return {
        ...updatedWishlist,
        owner: getEntityPartial(
          updatedWishlist.owner,
          userPublicProfileResponseDtoFields,
        ),
      };
    });
  }

  remove(id: number, currentUser: User) {
    return this.wishlistRepository
      .findOne({
        where: { id },
        relations: ['owner', 'items'],
      })
      .then((wishlist) => {
        if (!wishlist) {
          throw new NotFoundException('Wishlist not found');
        }
        if (wishlist?.owner?.id !== currentUser?.id)
          throw new ForbiddenException('Нельзя удалять чужие коллекции');
        return this.wishlistRepository.delete(id).then(() => wishlist);
      });
  }
}
