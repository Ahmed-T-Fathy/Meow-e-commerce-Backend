import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Color } from './color.entity';
import { Repository } from 'typeorm';
import { CreateColorDTO } from './dtos/create-color.dto';
import { UpdateColorDTO } from './dtos/update-color.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ColorsPaginationQueryDTO } from './dtos/color-pagination-query.dto';

@Injectable()
export class ColorsService {
  constructor(@InjectRepository(Color) private colorRepo: Repository<Color>) {}

  async createColor(color: CreateColorDTO): Promise<Color> {
    const createColor = this.colorRepo.create(color);
    return await this.colorRepo.save(createColor);
  }

  async getColorById(id: string): Promise<Color> {
    const color = await this.colorRepo.findOne({ where: { id } });
    if (!color) {
      throw new NotFoundException('Color not found!');
    }
    return color;
  }

  async deleteColor(id: string) {
    const color = await this.getColorById(id);
    await this.colorRepo.remove(color);
  }

  async paginateColors(
    options: IPaginationOptions,
    other: ColorsPaginationQueryDTO,
  ): Promise<Pagination<Color>> {
    const queryBuilder = this.colorRepo.createQueryBuilder('c');
    if (other?.orderBy) {
      other.orderBy.forEach((orderBy) => {
        queryBuilder.addOrderBy(`c.${orderBy.field}`, orderBy.direction);
      });
    }

    if (other?.color) {
      queryBuilder.andWhere('c.color LIKE :color', {
        color: `%${other.color}%`,
      });
    }

    if (other?.code) {
      queryBuilder.andWhere('c.code LIKE :code', {
        code: `%${other.code}%`,
      });
    }
    return await paginate<Color>(queryBuilder, options);
  }

  async updateColor(id: string, updateDto: UpdateColorDTO) {
    try {
      const color = await this.getColorById(id);
      return await this.colorRepo.update({ id }, updateDto);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
