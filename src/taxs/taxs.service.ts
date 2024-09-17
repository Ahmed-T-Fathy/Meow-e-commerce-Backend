import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tax } from './tax.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaxDTO } from './dtos/create-tax.dto';
import { UUIDDTO } from 'src/dto/UUID-dto';
import { UpdateTaxDTO } from './dtos/update-tax.dto';

@Injectable()
export class TaxsService {
  constructor(
    @InjectRepository(Tax) private readonly taxRepo: Repository<Tax>,
  ) {}

  private async createTax(createTaxObj: CreateTaxDTO) {
    try {
      const createdTax = await this.taxRepo.create(createTaxObj);
      return await this.taxRepo.save(createTaxObj);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getTaxById(id: string): Promise<Tax> {
    const tax = await this.taxRepo.findOne({ where: { id } });
    if (!tax) {
      throw new NotFoundException('tax not found!');
    }
    return tax;
  }

  async deleteTax(id: string) {
    const tax = await this.getTaxById(id);
    await this.taxRepo.remove(tax);
  }

  async updateTax(id: string, updateDto: UpdateTaxDTO) {
    try {
      const tax = await this.getTaxById(id);
      Object.assign(tax, updateDto);
      return await this.taxRepo.save(tax);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getAllTaxs() {
    try {
      const taxs = await this.taxRepo.find();
      let neededTaxs = ['TAX', 'Delivery service'];
      taxs.map((t) => {
        if (neededTaxs.includes(t.title)) {
          neededTaxs = neededTaxs.filter((ts) => ts != t.title);
        }
      });
      await Promise.all(neededTaxs.map(async t=>{
        await this.createTax({title:t,value:0});
      }))
      return await this.taxRepo.find();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
