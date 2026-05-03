import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { OffersService } from './offers.service';
import { WishesService } from '../wishes/wishes.service';
import {
  mockOfferRepository,
  mockWishesService,
  mockWishRepository,
} from '../common/test-mocks/test-mocks';
import { Wish } from '../wishes/entities/wish.entity';
import { Offer } from './entities/offer.entity';

describe('OffersService', () => {
  let service: OffersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<OffersService>(OffersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
