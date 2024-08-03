import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './photo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhotosService {
  constructor(@InjectRepository(Photo) photoRepo: Repository<Photo>) {

    
  }
}
