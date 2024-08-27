import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]),AuthModule],
    providers: [CategoriesService],
  controllers: [CategoriesController],
  exports:[TypeOrmModule]
})
export class CategoriesModule {}
