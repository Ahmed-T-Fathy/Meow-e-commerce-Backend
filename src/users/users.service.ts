import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { EditUserProfileDTO } from './dtos/edit-user-profile.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { UsersPaginationDTO } from './dtos/users-pagination-query.dto';
import { retry } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private usersRepo: Repository<Users>) {}
  async findUserById(id: string): Promise<Users> {
    if (!id) {
      throw new BadRequestException('id is required!');
    }
    const user = await this.usersRepo.findOneOrFail({ where: { id } });

    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  async updateUser(id: string, update_user_dto: UpdateUserDTO) {
    try {
      const user = await this.findUserById(id);

      Object.assign(user, update_user_dto);
      // If password is being updated, ensure it's hashed
      if (update_user_dto?.password) {
        await user.hashPassword(update_user_dto.password);
      }

      const updated_user = await this.usersRepo.save(user);
      return updated_user;
    } catch (err) {
      throw new ConflictException(err);
    }
  }

  async editUserProfile(id: string, edit_user_profile_dto: EditUserProfileDTO) {
    try {
      const user = await this.findUserById(id);
      Object.assign(user, edit_user_profile_dto);
      // If password is being updated, ensure it's hashed
      if (edit_user_profile_dto.password) {
        await user.hashPassword(edit_user_profile_dto.password);
      }

      const updated_user = await this.usersRepo.save(user);
      return updated_user;
    } catch (err) {
      throw new ConflictException(err);
    }
  }

  async paginateUsers(
    options: IPaginationOptions,
    other: UsersPaginationDTO,
  ): Promise<Pagination<Users>> {
    const queryBuilder = this.usersRepo.createQueryBuilder('u');
    if (other?.orderBy) {
      other.orderBy.forEach((orderBy) => {
        queryBuilder.addOrderBy(`u.${orderBy.field}`, orderBy.direction);
      });
    }

    //  Get user name using matching pattern or partial string matching
    if (other?.username) {
      queryBuilder.andWhere('LOWER(u.username) ILIKE LOWER(:username)', {
        username: `%${other.username}%`,
      });
    }
    if (other?.email) {
      queryBuilder.andWhere('LOWER(u.email) ILIKE LOWER(:email)', {
        email: `%${other.email}%`,
      });
    }
    if (other?.phone) {
      queryBuilder.andWhere('LOWER(u.phone) ILIKE LOWER(:phone)', {
        phone: `%${other.phone}%`,
      });
    }
    if (other?.role) {
      queryBuilder.andWhere('u.role = :role', { role: other.role });
    }

    if (other?.is_verified !== undefined) {
      //   console.log(other?.is_verified);

      queryBuilder.andWhere('u.is_verified = :is_verified', {
        is_verified: other.is_verified,
      });
    }

    return await paginate<Users>(queryBuilder, options);
  }

  async deleteUser(id: string) {
    const user: Users = await this.findUserById(id);
    return this.usersRepo.remove(user);
  }

  async getUserByPhoneNumber(phoneNumber:string): Promise<Users> {
    if(!phoneNumber){
      throw new BadRequestException("phoneNumber is required!");
    }
    let user: Users = await this.usersRepo.findOne({
      where: {
        phone: phoneNumber,
      },
    });
    return user;
  }
  async getUserByEmail(email: string): Promise<Users> {
    if (!email) {
      throw new BadRequestException('email is required!');
    }
    let user: Users = await this.usersRepo.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  async verifyMe(phoneNumber: string) {
    try {
      let user: Users = await this.usersRepo.findOne({
        where: {
          phone:phoneNumber
        }
      })
      user.is_verified = true;

      return await this.usersRepo.save(user);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
