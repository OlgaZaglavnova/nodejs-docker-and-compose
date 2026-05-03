import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';
import { WishesService } from '../wishes/wishes.service';
import {
  mockOfferRepository,
  mockWishesService,
  mockWishRepository,
} from '../common/test-mocks/test-mocks';
import { Wish } from '../wishes/entities/wish.entity';

describe('OffersController', () => {
  let controller: OffersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffersController],
      providers: [
        OffersService,
        {
          provide: WishesService,
          useValue: mockWishesService,
        },
        {
          provide: getRepositoryToken(Wish),
          useValue: mockWishRepository,
        },
        {
          provide: getRepositoryToken(Offer),
          useValue: mockOfferRepository,
        },
      ],
    }).compile();

    controller = module.get<OffersController>(OffersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
