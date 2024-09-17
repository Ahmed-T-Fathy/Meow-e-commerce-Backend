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
  UseGuards,
} from '@nestjs/common';
import { TaxsService } from './taxs.service';
import { AuthGaurd } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateTaxDTO } from './dtos/update-tax.dto';
import { UUIDDTO } from 'src/dto/UUID-dto';

@Controller('taxs')
export class TaxsController {
  constructor(private readonly taxsService: TaxsService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Get()
  async getAllTaxs() {
    return await this.taxsService.getAllTaxs();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Patch('/:id')
  async updateTax(@Param() paramObj: UUIDDTO, @Body() updateObj: UpdateTaxDTO) {
    return await this.taxsService.updateTax(paramObj.id, updateObj);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Delete('/:id')
  async deleteTax(@Param() paramObj: UUIDDTO) {
    return await this.taxsService.deleteTax(paramObj.id);
  }
}
