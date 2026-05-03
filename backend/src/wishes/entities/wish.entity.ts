import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsUrl,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import {
  WISH_DESCRIPTION_MAX_LENGTH,
  WISH_DESCRIPTION_MIN_LENGTH,
  WISH_NAME_MAX_LENGTH,
  WISH_NAME_MIN_LENGTH,
} from '../../common/constants/constants';
import { INCORRECT_URL_MESSAGE } from '../../common/constants/messages';

@Entity()
export class Wish extends BaseEntity {
  // name
  @Column({
    type: 'varchar',
  })
  @Length(WISH_NAME_MIN_LENGTH, WISH_NAME_MAX_LENGTH, {
    message: `Название подарка должно содержать от ${WISH_NAME_MIN_LENGTH} до ${WISH_NAME_MAX_LENGTH} символов`,
  })
  name: string;

  // link
  @Column({
    type: 'varchar',
  })
  @IsUrl({}, { message: INCORRECT_URL_MESSAGE })
  link: string;

  // image
  @Column({
    type: 'varchar',
  })
  @IsUrl({}, { message: INCORRECT_URL_MESSAGE })
  image: string;

  //price
  @Column({
    type: 'decimal',
    precision: 10, // максимальное количество цифр
    scale: 2, // количество знаков после запятой
    nullable: false,
  })
  @IsNotEmpty({ message: 'Цена обязательна' })
  @IsPositive({ message: 'Цена должна быть положительным числом' })
  @Min(1, { message: 'Минимальная цена - 1' })
  @Max(9999999.99, { message: 'Цена слишком большая' })
  price: number;

  // raised
  @Column({
    type: 'decimal',
    precision: 10, // максимальное количество цифр
    scale: 2, // количество знаков после запятой,
    default: 0,
  })
  @IsPositive({
    message: 'Сумма предварительного сбора должна быть положительным числом',
  })
  @Min(0) // По swagger MIN=1, но если никто не скинулся на подарок, тут должен быть 0. По логике минимум должен быть 0
  raised: number;

  // description
  @Column({
    type: 'varchar',
  })
  @Length(WISH_DESCRIPTION_MIN_LENGTH, WISH_DESCRIPTION_MAX_LENGTH, {
    message: `Описание подарка должно содержать от ${WISH_DESCRIPTION_MIN_LENGTH} до ${WISH_DESCRIPTION_MAX_LENGTH} символов`,
  })
  description: string;

  // copied
  @Column({
    type: 'int', // целое число
    default: 0, // значение по умолчанию
    nullable: false, // NOT NULL
    unsigned: true, // только положительные числа (для MySQL)
    name: 'copied',
  })
  @IsInt({ message: 'Счётчик должен быть целым числом' })
  @Min(0, { message: 'Счётчик не может быть отрицательным' })
  copied: number;

  // owner: User
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;
  // owner: UserPublicProfileResponseDto;

  // offers
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  // wishlists
  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlists: Wishlist[];
}
