import { CreateCategoryDTO } from './createCategory.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCategoryDTO extends PartialType(CreateCategoryDTO) {}
