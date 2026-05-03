import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';
import { fullOfferSelectFields } from './dto/full-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  create(createOfferDto: CreateOfferDto, currentUser: User) {
    return this.wishesService
      .findOneForOffer(createOfferDto.itemId)
      .then((wish) => {
        if (currentUser.id === wish.owner?.id) {
          throw new ForbiddenException('Нельзя делать подарки самому себе');
        }
        // нельзя скинуться на подарки, на которые уже собраны деньги.
        if (!wish.price) throw new NotFoundException('Цена подарка не указана');
        if (!wish.raised) wish.raised = 0;
        const lackAmount = wish.price - wish.raised;
        if (lackAmount <= 0)
          throw new ForbiddenException('На этот подарок уже собраны деньги');
        if (createOfferDto.amount > lackAmount)
          throw new ForbiddenException(
            `Сумма предложения превышает необходимую для покупки подарка сумму. Сумма предложения должна быть не более ${lackAmount} руб.`,
          );
        const createOffer = {
          amount: createOfferDto.amount,
          hidden: createOfferDto.hidden,
          item: wish,
          user: currentUser,
        };
        return this.offerRepository.save(createOffer).then((_createdOffer) => {
          // update raised and return {} accorrdingly to swagger
          return this.wishesService.updateRaised(
            createOfferDto.itemId,
            createOfferDto.amount,
          );
        });
      });
  }

  findAll() {
    return this.offerRepository.find({
      relations: ['user', 'item'],
      select: fullOfferSelectFields,
    });
  }

  async findOne(id: number) {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['user', 'item'],
      select: fullOfferSelectFields,
    });

    if (!offer) {
      throw new NotFoundException();
    }

    return offer;
  }
}
