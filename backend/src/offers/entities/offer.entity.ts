import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsPositive } from 'class-validator';

import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Offer extends BaseEntity {
  // amount
  @Column({
    type: 'decimal',
    precision: 10, // максимальное количество цифр
    scale: 2, // количество знаков после запятой
    nullable: false,
  })
  @IsPositive({ message: 'Сумма заявки должна быть положительным числом' })
  @IsNotEmpty({ message: 'Сумма заявки обязательна' })
  amount: number;

  // hidden
  @Column({
    type: 'boolean',
    default: false,
  })
  @IsNotEmpty({
    message:
      'Флаг, определяющий показывать или скрывать пользователя, обязателен',
  })
  hidden: boolean;

  // user
  @ManyToOne(() => User, (user) => user.offers)
  @JoinColumn()
  @IsNotEmpty({ message: 'Пользователь обязателен' })
  user: User;

  // item: Wish
  @ManyToOne(() => Wish, (wish) => wish.offers)
  @JoinColumn()
  @IsNotEmpty({ message: 'Подарок обязателен' })
  item: Wish;
}
