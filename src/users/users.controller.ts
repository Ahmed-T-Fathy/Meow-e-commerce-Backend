import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGaurd } from 'src/auth/guards/auth.guard';
import { UUIDDTO } from 'src/dto/UUID-dto';
import { Role } from './roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { EditUserProfileDTO } from './dtos/edit-user-profile.dto';
import { UsersService } from './users.service';
import { query } from 'express';
import { UsersPaginationDTO } from './dtos/users-pagination-query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Users } from './users.entity';

@Controller('users')
export class UsersController {
  constructor(private users_sevice: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Patch('/:id')
  updateUser(@Param() paramObj: UUIDDTO, update_user_dto: UpdateUserDTO) {
    return this.users_sevice.updateUser(paramObj.id, update_user_dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGaurd)
  @Patch('profile/:id')
  editUserProfile(
    @Param() paramObj: UUIDDTO,
    edit_user_profile_dto: EditUserProfileDTO,
  ) {
    return this.users_sevice.editUserProfile(paramObj.id,edit_user_profile_dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Get('')
  async getAllUser(
    @Query() queryDto:UsersPaginationDTO,
  ):Promise<Pagination<Users>>{
    const page = queryDto.page;
    const limit = queryDto.limit;
    return await this.users_sevice.paginateUsers({
      page,
      limit,
      route: 'users/',
    },
  queryDto);
  }
}
