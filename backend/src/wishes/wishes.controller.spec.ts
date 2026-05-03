import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';
import { Wish } from './entities/wish.entity';
import { mockWishRepository } from '../common/test-mocks/test-mocks';

describe('WishesController', () => {
  let controller: WishesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishesController],
      providers: [
        WishesService,
        {
          provide: getRepositoryToken(Wish),
          useValue: mockWishRepository,
        },
      ],
    }).compile();

    controller = module.get<WishesController>(WishesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
