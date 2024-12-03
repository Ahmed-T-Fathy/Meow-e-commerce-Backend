import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGaurd } from 'src/auth/guards/auth.guard';
import { UUIDDTO } from 'src/dto/UUID-dto';
import { Role } from './roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { EditUserProfileDTO } from './dtos/edit-user-profile.dto';
import { UsersService } from './users.service';
import { UsersPaginationDTO } from './dtos/users-pagination-query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Users } from './users.entity';
import { CreateUserDTO } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private users_sevice: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Post()
  async createUser(@Body() data: CreateUserDTO) {
    return await this.users_sevice.createUser(data);
   } 
    
    
    
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Patch('edit/:id')
  async updateUser(
    @Param() paramObj: UUIDDTO,
    @Body() update_user_dto: UpdateUserDTO,
  ) {
    return await this.users_sevice.updateUser(paramObj.id, update_user_dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGaurd)
  @Patch('profile/:id')
  editUserProfile(
    @Param() paramObj: UUIDDTO,
    @Body() edit_user_profile_dto: EditUserProfileDTO,
  ) {
    return this.users_sevice.editUserProfile(
      paramObj.id,
      edit_user_profile_dto,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Get('')
  async getAllUser(
    @Query() queryDto: UsersPaginationDTO,
  ): Promise<Pagination<Users>> {
    const page = queryDto.page;
    const limit = queryDto.limit;
    return await this.users_sevice.paginateUsers(
      {
        page,
        limit,
        route: 'users/',
      },
      queryDto,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Get('/:id')
  async getUser(@Param() paramObj: UUIDDTO): Promise<Users> {
    return await this.users_sevice.findUserById(paramObj.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Delete('/:id')
  async deleteUser(@Param() paramObj: UUIDDTO) {
    return await this.users_sevice.deleteUser(paramObj.id);
  }
}
