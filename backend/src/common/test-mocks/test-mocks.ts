const mockRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
};

// OFFER
// Создаем мок репозитория
export const mockOfferRepository = {
  ...mockRepository,
};

// USER
// Создаем мок репозитория
export const mockUserRepository = {
  ...mockRepository,
};

// WISH
// Создаем мок репозитория
export const mockWishRepository = {
  ...mockRepository,
};

// Мок для WishesService
export const mockWishesService = {
  getLast: jest.fn().mockResolvedValue([
    { id: 1, name: 'Wish 1', owner: { id: 1 }, offers: [] },
    { id: 2, name: 'Wish 2', owner: { id: 2 }, offers: [] },
  ]),
  getTop: jest.fn().mockResolvedValue([
    { id: 1, name: 'Wish 1', owner: { id: 1 }, offers: [] },
    { id: 2, name: 'Wish 2', owner: { id: 2 }, offers: [] },
  ]),
  create: jest.fn().mockResolvedValue({}),
  findOne: jest.fn().mockResolvedValue({
    id: 2,
    name: 'Wish 2',
    owner: { id: 2 },
    offers: [],
  }),
  findOneForOffer: jest.fn().mockResolvedValue({
    id: 2,
    name: 'Wish 2',
    owner: { id: 2 },
  }),
  update: jest.fn().mockResolvedValue({}),
  remove: jest.fn().mockResolvedValue({}),
  copy: jest.fn().mockResolvedValue({}),
  findWishesForWishlistByIds: jest.fn().mockResolvedValue([
    { id: 1, name: 'Wish 1', owner: { id: 1 }, offers: [] },
    { id: 2, name: 'Wish 2', owner: { id: 2 }, offers: [] },
  ]),
  updateRaised: jest.fn().mockResolvedValue({
    id: 2,
    name: 'Wish 2',
    owner: { id: 2 },
    raised: 1,
  }),
};

// WISHLIST
// Создаем мок репозитория
export const mockWishlistRepository = {
  ...mockRepository,
};
