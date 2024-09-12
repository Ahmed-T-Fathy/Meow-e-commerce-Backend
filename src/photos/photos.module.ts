import { Module } from '@nestjs/common';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './photo.entity';
// import { Color } from 'src/colors/color.entity';
import { Product } from 'src/products/product.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([Photo,
    // Color,
    Product]),
    AuthModule],
  controllers: [PhotosController],
  providers: [PhotosService]
})
export class PhotosModule {}
