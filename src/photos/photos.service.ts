import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './photo.entity';
import { DeepPartial, Repository } from 'typeorm';
import { Color } from 'src/colors/color.entity';
import { Product } from 'src/products/product.entity';
import { AssignPhotosDTO } from './dtos/assign-photo.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { PhotosPaginationDTO } from './dtos/photos-paginate.dto';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo) private photoRepo: Repository<Photo>,
    @InjectRepository(Color) private colorRepo: Repository<Color>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async asignPhotosToProduct(
    photos: Array<Express.Multer.File>,
    data: AssignPhotosDTO,
  ): Promise<Photo[]> {
    let createdPhotos: Photo[] = [];
    const product = await this.productRepo.findOne({
      where: { id: data.productId },
    });
    if (!product) throw new NotFoundException('Product Not found!');
    const color = await this.colorRepo.findOne({ where: { id: data.colorId } });
    if (!color) throw new NotFoundException('Color Not found!');

    await Promise.all(
      photos.map((photo) => {
        let photoObj = new Photo();
        photoObj.link = photo.path.replace('uploads', '');
        photoObj.is_main = false;
        photoObj.product = product;
        photoObj.color = color;

        createdPhotos.push(photoObj);
      }),
    );

    return await this.photoRepo.save(createdPhotos);
  }
  async deletePhoto(id: string) {
    const photo = await this.getPhotoById(id);
    await this.photoRepo.remove(photo);
  }

  async getPhotoById(id: string): Promise<Photo> {
    const photo = await this.photoRepo.findOne({ where: { id } });
    if (!photo) {
      throw new NotFoundException('Photo not found!');
    }
    return photo;
  }

  async paginatePhotos(
    options: IPaginationOptions,
    other: PhotosPaginationDTO,
  ): Promise<Pagination<Photo>> {
    const queryBuilder = this.photoRepo.createQueryBuilder('p');
    if (other?.orderBy) {
      other.orderBy.forEach((orderBy) => {
        queryBuilder.addOrderBy(`p.${orderBy.field}`, orderBy.direction);
      });
    }

    if (other?.color) {
      const color = await this.colorRepo.findOneBy({ id: other.color });
      if (!color) throw new NotFoundException('Color not found!');
      queryBuilder.andWhere('p.colorId = :color', { color: other.color });
    }
    if (other?.product) {
      const product = await this.productRepo.findOneBy({ id: other.product });
      if (!product) throw new NotFoundException('Product not found!');
      queryBuilder.andWhere('p.productId = :product', {
        product: other.product,
      });
    }

    if (other?.is_main !== undefined) {
      console.log(other?.is_main);
      
      queryBuilder.andWhere('p.is_main = :is_main', { is_main: other.is_main });
    }

    return await paginate<Photo>(queryBuilder, options);
  }

  async asignMainPhotoToProduct(
    photo: Express.Multer.File,
    data: AssignPhotosDTO,
  ): Promise<Photo>{
    const product = await this.productRepo.findOne({
      where: { id: data.productId },
    });
    if (!product) throw new NotFoundException('Product Not found!');
    const color = await this.colorRepo.findOne({ where: { id: data.colorId } });
    if (!color) throw new NotFoundException('Color Not found!');

    let photoObj = data as DeepPartial<Photo>;
    photoObj.link = photo.path.replace('uploads', '');
    photoObj.is_main = true;

    return await this.photoRepo.save(photoObj);
  }
}
