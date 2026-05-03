import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import {
  LAST_WISHES_COUNT,
  TOP_WISHES_COUNT,
} from '../common/constants/constants';
import { meWishSelectFields } from '../users/dto/user-wishes.dto';
import { User } from '../users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishForOffer } from './dto/wish-for-offer.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async getLast() {
    return this.wishesRepository.find({
      select: meWishSelectFields,
      order: {
        createdAt: 'DESC',
      },
      take: LAST_WISHES_COUNT,
      relations: {
        owner: true, // загружаем владельца
        offers: {
          item: true,
          user: true,
        }, // загружаем offers
      },
    });
  }

  async getTop() {
    return this.wishesRepository.find({
      select: meWishSelectFields,
      order: {
        copied: 'DESC',
      },
      take: TOP_WISHES_COUNT,
      relations: {
        owner: true, // загружаем владельца
        offers: {
          item: true,
          user: true,
        }, // загружаем offers
      },
    });
  }

  create(createWishDto: CreateWishDto, user: User) {
    return this.wishesRepository
      .save({
        ...createWishDto,
        owner: user,
      })
      .then((_createdWish) => {
        // выдадим пустой объект в соответствии со swagger
        return {};
      });
  }

  findOne(id: number): Promise<Wish | null> {
    return this.wishesRepository
      .findOne({
        where: { id },
        relations: ['owner', 'offers', 'offers.user'],
        select: meWishSelectFields,
      })
      .then((wish) => {
        if (!wish || !wish.id) throw new NotFoundException();
        return wish;
      });
  }

  async findOneForOffer(id: number): Promise<Partial<Wish>> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!wish) {
      throw new NotFoundException();
    }
    const offerItem = new WishForOffer();
    Object.assign(offerItem, wish);
    return offerItem;
  }

  async update(id: number, updateWishDto: UpdateWishDto, currentUser: User) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

    if (!wish) {
      throw new NotFoundException(`Подарок с id = ${id} не найден`);
    }
    if (wish.owner?.id !== currentUser.id) {
      throw new ForbiddenException('Редактировать можно только свои подарки');
    }
    if (
      wish.offers.length > 0 &&
      updateWishDto.price &&
      updateWishDto.price !== wish.price
    ) {
      throw new ForbiddenException(
        'Нельзя менять стоимость подарка, если уже есть желающие скинуться',
      );
    }
    // Удалим вычисляемые поля
    delete updateWishDto.raised;
    delete updateWishDto.copied;
    delete updateWishDto.offers;

    return this.wishesRepository.update({ id }, updateWishDto);
  }

  remove(id: number, currentUser: User) {
    return this.wishesRepository
      .findOne({
        where: { id },
        relations: ['offers', 'owner'],
      })
      .then((wish) => {
        if (!wish) throw new NotFoundException();
        if (wish.owner?.id !== currentUser?.id)
          throw new ForbiddenException('Удалять можно только свои подарки');
        if (wish.offers.length > 0)
          throw new ForbiddenException(
            'Для данного подарка уже есть желающие вложиться в его покупку',
          );

        return this.wishesRepository.delete(id);
      });
  }

  copy(wishId: number, currentUser: User) {
    return this.wishesRepository
      .findOne({
        where: { id: wishId },
        relations: ['owner'],
      })
      .then((wish) => {
        if (!wish) {
          throw new NotFoundException(`Желание ${wishId} не найдено`);
        }
        if (wish?.owner?.id === currentUser.id) {
          throw new ForbiddenException('Нельзя копировать себе свои желания');
        }

        wish.copied++;
        // обновим существующий wish с новым значением copied

        return this.wishesRepository.save(wish);
      })
      .then((wish: Wish) => {
        // создадим копию Wish для текущего пользователя
        const copiedWish = {
          name: wish.name,
          link: wish.link,
          image: wish.image,
          price: wish.price,
          description: wish.description,
        } as CreateWishDto;

        return this.create(copiedWish, currentUser);
      });
  }

  findWishesForWishlistByIds(itemIds: number[]): Promise<Wish[]> {
    return this.wishesRepository.find({
      where: { id: In(itemIds) },
    });
  }

  async updateRaised(id: number, amount: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
    });

    if (!wish) {
      throw new NotFoundException(`Подарок с id = ${id} не найден`);
    }
    const updateData = { raised: +wish.raised + amount };
    const updatedWish = await this.wishesRepository.update({ id }, updateData);
    return updatedWish;
  }
}
