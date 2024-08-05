import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
import { AssignPhotosDTO } from './dtos/assign-photo.dto';
import { PhotosService } from './photos.service';
import { PhotoIdDTO } from './dtos/photo-id.dto';
import { PhotosPaginationDTO } from './dtos/photos-paginate.dto';
import { Photo } from './photo.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
@Controller('photos')
export class PhotosController {
  constructor(private photosService: PhotosService) {}

  @Get('')
  async getAllPhotos(
    @Query() queryDto: PhotosPaginationDTO,
  ): Promise<Pagination<Photo>> {
    const page = queryDto.page;
    const limit = queryDto.limit;
    return await this.photosService.paginatePhotos({
      page,
      limit,
      route: 'photos/',
    },
  queryDto);
  }

  @Post('')
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: './uploads/media',
        filename: (req, file, callback) => {
          const filename = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFiles(
    @Body() body: AssignPhotosDTO,
    @UploadedFiles() photos: Array<Express.Multer.File>,
  ) {
    if(!photos)throw new BadRequestException('there is no photos to add them!')

    return await this.photosService.asignPhotosToProduct(photos, body);
  }

  @Post('/main')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/media',
        filename: (req, file, callback) => {
          const filename = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(
    @Body() body: AssignPhotosDTO,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    if(!photo)throw new BadRequestException('there is no photo to add it!')
    return await this.photosService.asignMainPhotoToProduct(photo,body);
    
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deletePhoto(@Param() paramObj: PhotoIdDTO) {
    return await this.photosService.deletePhoto(paramObj.id);
  }
}
