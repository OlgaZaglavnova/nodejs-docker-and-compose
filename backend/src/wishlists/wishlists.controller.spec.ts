import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';
import { WishesService } from '../wishes/wishes.service';
import {
  mockWishesService,
  mockWishlistRepository,
  mockWishRepository,
} from '../common/test-mocks/test-mocks';
import { Wishlist } from './entities/wishlist.entity';
import { Wish } from '../wishes/entities/wish.entity';

describe('WishlistsController', () => {
  let controller: WishlistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistsController],
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

    controller = module.get<WishlistsController>(WishlistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
