import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Category } from 'src/categories/category.entity';
import { In, Repository } from 'typeorm';

@ValidatorConstraint({ name: 'categoriesExists', async: true })
@Injectable()
export class CategoryExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}
  async validate(
    categoryIds: string[],
    validationArguments?: ValidationArguments,
  ):Promise<boolean> {
    if (!categoryIds || categoryIds.length === 0){
        return false;
    }

    const foundCategories = await this.categoryRepo.findBy({
      id: In(categoryIds),
    });

    return foundCategories.length===categoryIds.length
  }
  defaultMessage(args: ValidationArguments) {
    return 'One or more categories do not exist';
  }
}
