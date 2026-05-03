import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';
import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from '../../common/base.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { INCORRECT_URL_MESSAGE } from '../../common/constants/messages';
import {
  USER_ABOUT_MAX_LENGTH,
  USER_ABOUT_MIN_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from '../../common/constants/constants';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
  // username
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  @Index()
  @Length(USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH, {
    message: `Имя пользователя должно содержать от ${USERNAME_MIN_LENGTH} до ${USERNAME_MAX_LENGTH} символов`,
  })
  @IsNotEmpty({ message: 'Имя пользователя обязательно' })
  username: string;

  //about
  @Column({
    type: 'varchar',
    default: 'Пока ничего не рассказал о себе',
  })
  @IsOptional()
  @Length(USER_ABOUT_MIN_LENGTH, USER_ABOUT_MAX_LENGTH, {
    message: `Информация о пользователе должна содержать от ${USER_ABOUT_MIN_LENGTH} до ${USER_ABOUT_MAX_LENGTH} символов`,
  })
  about: string;

  // avatar
  @Column({
    type: 'varchar',
    default: 'https://i.pravatar.cc/300',
  })
  @IsOptional()
  @IsUrl({}, { message: INCORRECT_URL_MESSAGE })
  avatar?: string;

  //email
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  @Index()
  @IsEmail()
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  //password
  @Exclude()
  @Column()
  @MinLength(USER_PASSWORD_MIN_LENGTH)
  password: string;

  // wishes
  @OneToMany(() => Wish, (wish) => wish.owner, {
    cascade: ['insert', 'update'],
  })
  wishes: Wish[];

  //offers
  @OneToMany(() => Offer, (offer) => offer.user, {
    cascade: ['insert', 'update'],
  })
  offers: Offer[];

  //wishlist
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner, {
    cascade: ['insert', 'update'],
  })
  wishlists: Wishlist[];
}
