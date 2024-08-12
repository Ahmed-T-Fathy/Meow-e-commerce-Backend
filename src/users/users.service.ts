import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private usersRepo:Repository<Users>){}
    async findUserById(id:string):Promise<Users>{
        return await this.usersRepo.findOne({where:{id}});
    }
}
