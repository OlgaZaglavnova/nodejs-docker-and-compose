import { userPublicProfileSelectFields } from '../../users/dto/user-public-profile-response.dto';
import { wishSelectFields } from '../../wishes/dto/wish-select.dto';

export const selectWishlistFields = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  image: true,
  owner: userPublicProfileSelectFields,
  items: wishSelectFields,
};
