import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  Repository,
} from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from '../hashing/hash.service';
import { findUserDto } from './dto/find-users.dto';
import {
  SignupUserResponseDto,
  signupUserResponseDtoFields,
} from './dto/signup-user-response.dto';
import {
  UserProfileResponseDto,
  userProfileSelectFields,
} from './dto/user-profile-response.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { USER_NOT_FOUND_MESSAGE } from '../common/constants/messages';
import { UsersWish } from '../wishes/dto/users-wish.dto';
import { userPublicProfileSelectFields } from './dto/user-public-profile-response.dto';
import { meWishesSelectFields } from './dto/user-wishes.dto';
import { getEntityPartial } from '../common/helpers/entity-partial.helper';
import { DatabaseError } from '../common/types/db-error';
import { userAuthFields } from './dto/user-auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  // TMP
  getAll() {
    return this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<SignupUserResponseDto> {
    try {
      // заменим пароль на hash
      const passwordHash = await this.hashService.hash(createUserDto.password);
      const hashedUser = {
        ...createUserDto,
        password: passwordHash,
      };
      const createdUser: User = await this.userRepository.save(hashedUser);
      return getEntityPartial(
        createdUser,
        signupUserResponseDtoFields,
      ) as SignupUserResponseDto;
    } catch (error) {
      const dbErr = error as DatabaseError;
      if (dbErr.code === '23505')
        throw new ConflictException('Такой пользователь уже зарегистрирован');
      throw error;
    }
  }

  findAll() {
    return this.userRepository.find({
      select: userPublicProfileSelectFields,
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      select: userPublicProfileSelectFields,
    });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_MESSAGE(username));
    }

    return user;
  }

  findUserWishes(username: string) {
    return this.findWishesByUsername(
      username,
      {
        wishes: {
          offers: {
            user: true,
            item: true,
          },
        },
      },
      meWishesSelectFields,
    );
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user || !user.id) {
      throw new NotFoundException('Пользователь не найден');
    }

    try {
      // хэшируем новый пароль
      if (updateUserDto.password) {
        updateUserDto.password = await this.hashService.hash(
          updateUserDto.password,
        );
      }
      Object.assign(user, updateUserDto);

      const updatedUser = await this.userRepository.save(user);

      return updatedUser;
    } catch (error) {
      const dbErr = error as DatabaseError;
      if (dbErr.code === '23505')
        throw new ConflictException('Такой пользователь уже зарегистрирован');
      throw error;
    }
  }

  async findUsersByEmailOrName(
    params: findUserDto,
  ): Promise<UserProfileResponseDto[]> {
    const { query } = params;
    return this.userRepository.find({
      where: [{ username: query }, { email: query }],
      select: userProfileSelectFields,
    });
  }

  findMeWishes(myName: string): Promise<Wish[]> {
    return this.findWishesByUsername(
      myName,
      {
        wishes: {
          offers: {
            user: true,
          },
          owner: true,
        },
      },
      meWishesSelectFields,
    );
  }

  private findWishesByUsername(
    username: string,
    relations?: FindOptionsRelations<User>,
    select?: FindOptionsSelect<User>,
  ): Promise<UsersWish[]> {
    const findConditions: FindOneOptions<User> = {
      where: { username },
    };
    if (relations) {
      findConditions.relations = relations;
    }
    if (select) {
      findConditions.select = select;
    }
    return this.userRepository.findOne(findConditions).then((user) => {
      if (!user || !user.id)
        throw new NotFoundException(USER_NOT_FOUND_MESSAGE(username));
      return user?.wishes || [];
    });
  }

  findByUsernameForAuth(username: string) {
    return this.userRepository.findOne({
      where: { username },
      select: userAuthFields,
    });
  }
}
