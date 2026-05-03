import { userPublicProfileSelectFields } from '../../users/dto/user-public-profile-response.dto';

const offerItem = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  link: true,
  image: true,
  price: true,
  raised: true,
  copied: true,
  description: true,
};

export const fullOfferSelectFields = {
  id: true,
  createdAt: true,
  updatedAt: true,
  amount: true,
  hidden: true,
  item: offerItem,
  user: {
    id: true,
    createdAt: true,
    updatedAt: true,
    username: true,
    about: true,
    avatar: true,
    email: true,
    wishes: true,
    offers: true,
    wishlists: {
      id: true,
      createdAt: true,
      updatedAt: true,
      name: true,
      image: true,
      owner: userPublicProfileSelectFields,
      items: offerItem,
    },
  },
};
