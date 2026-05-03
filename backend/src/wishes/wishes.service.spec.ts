import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { WishesService } from './wishes.service';
import { Wish } from './entities/wish.entity';
import { mockWishRepository } from '../common/test-mocks/test-mocks';

describe('WishesService', () => {
  let service: WishesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishesService,
        {
          provide: getRepositoryToken(Wish),
          useValue: mockWishRepository,
        },
      ],
    }).compile();

    service = module.get<WishesService>(WishesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
