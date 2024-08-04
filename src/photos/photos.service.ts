import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './photo.entity';
import { Repository } from 'typeorm';
import { Color } from 'src/colors/color.entity';
import { Product } from 'src/products/product.entity';
import { AssignPhotosDTO } from './dtos/assign-photo.dto';

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
  ) :Promise<Photo[]>{
    let createdPhotos: Photo[] = [];
    const product = await this.productRepo.findOne({
      where: { id: data.productId },
    });
    if(!product)throw new NotFoundException("Product Not found!")
    const color = await this.colorRepo.findOne({ where: { id: data.colorId } });
    if(!color)throw new NotFoundException("Color Not found!")

    await Promise.all(
      photos.map((photo) => {
        let photoObj=new Photo();
        photoObj.link= photo.path.replace('uploads', '');
        photoObj.is_main=false;
        photoObj.product=product;
        photoObj.color=color;
        
        createdPhotos.push(photoObj);
      }),
    );

    return this.photoRepo.save(createdPhotos);
    
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
}
