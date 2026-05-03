import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { WishlistsService } from './wishlists.service';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';
import {
  mockWishesService,
  mockWishlistRepository,
  mockWishRepository,
} from '../common/test-mocks/test-mocks';

describe('WishlistsService', () => {
  let service: WishlistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistsService,
        {
          provide: WishesService,
          useValue: mockWishesService,
        },
        {
          provide: getRepositoryToken(Wishlist),
          useValue: mockWishlistRepository,
        },
        {
          provide: getRepositoryToken(Wish),
          useValue: mockWishRepository,
        },
      ],
    }).compile();

    service = module.get<WishlistsService>(WishlistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
