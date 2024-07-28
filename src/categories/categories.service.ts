import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CategoriesPaginationQueryDTO } from './dtos/categories-pagination-query.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async createCategory(category: CreateCategoryDTO): Promise<Category> {
    const createdCategory = this.categoryRepo.create(category);
    return await this.categoryRepo.save(createdCategory);
  }

  async paginateCategories(options:IPaginationOptions,other:CategoriesPaginationQueryDTO):Promise<Pagination<Category>>{
    const queryBuilder=this.categoryRepo.createQueryBuilder('c')
    if (other?.orderBy) {
      other.orderBy.forEach(orderBy => {
        queryBuilder.addOrderBy(`c.${orderBy.field}`, orderBy.direction);
      });
    }
  
    if (other?.name) {
      queryBuilder.andWhere('c.name LIKE :name', { name: `%${other.name}%` });
      console.log(queryBuilder);
      
    }
  
    if (other?.description) {
      queryBuilder.andWhere('c.description LIKE :description', { description: `%${other.description}%` });
    }
    return paginate<Category>(queryBuilder,options);
  }

  // async getAllCategories
}
