import {
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

import { BaseEntity } from '../../common/base.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { INCORRECT_URL_MESSAGE } from '../../common/constants/messages';
import {
  WISHLIST_DESCRIPTION_MAX_LENGTH,
  WISHLIST_NAME_MAX_LENGTH,
  WISHLIST_NAME_MIN_LENGTH,
} from '../../common/constants/constants';
import { WishPartial } from '../../wishes/dto/wish-partial';

@Entity()
export class Wishlist extends BaseEntity {
  // name
  @Column({
    type: 'varchar',
    nullable: false,
  })
  @Length(WISHLIST_NAME_MIN_LENGTH, WISHLIST_NAME_MAX_LENGTH, {
    message: `Название списка должно содержать от ${WISHLIST_NAME_MIN_LENGTH} до ${WISHLIST_NAME_MAX_LENGTH} символов`,
  })
  @IsNotEmpty({ message: 'Название списка обязательно' })
  name: string;

  // description
  @Column({
    type: 'varchar',
    nullable: true,
  })
  @MaxLength(WISHLIST_DESCRIPTION_MAX_LENGTH, {
    message: `Описание списка должно содержать не менее ${WISHLIST_DESCRIPTION_MAX_LENGTH} символов`,
  })
  @IsOptional()
  description: string;

  //image
  @Column({
    type: 'varchar',
    nullable: false,
  })
  @IsUrl({}, { message: INCORRECT_URL_MESSAGE })
  @IsNotEmpty({ message: 'Ссылка на обложку обязательна' })
  image: string;

  // owner
  @ManyToOne(() => User, (user) => user.wishlists)
  @IsNotEmpty({ message: 'Владелец списка подарков обязателен' })
  owner: User;
  // owner: UserPublicProfileResponseDto;

  // items: Wish[]
  @ManyToMany(() => Wish, (wish) => wish.wishlists, {
    cascade: true,
  })
  @JoinTable()
  @IsNotEmpty({ message: 'Элементы списка подарков обязательны' })
  items: WishPartial[];
}
