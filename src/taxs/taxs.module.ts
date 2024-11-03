import { Module } from '@nestjs/common';
import { TaxsController } from './taxs.controller';
import { TaxsService } from './taxs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tax } from './tax.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tax]), AuthModule],
  controllers: [TaxsController],
  providers: [TaxsService],
  exports:[TaxsService]
})
export class TaxsModule {}
