import { PickType } from '@nestjs/mapped-types';

import { Offer } from '../entities/offer.entity';

const createOfferDtoFields: (keyof Offer)[] = ['amount', 'hidden'];

export class CreateOfferDto extends PickType(Offer, createOfferDtoFields) {
  itemId: number;
}
