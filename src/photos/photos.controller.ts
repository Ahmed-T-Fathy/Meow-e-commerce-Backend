import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
@Controller('photos')
export class PhotosController {
  constructor(private photosService: PhotosService) {}
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
  uploadFile(
    @Body() body: AssignPhotosDTO,
    @UploadedFiles() photos: Array<Express.Multer.File>,
  ) {
    return this.photosService.asignPhotosToProduct(photos, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deletePhoto(@Param() paramObj: PhotoIdDTO) {
    return await this.photosService.deletePhoto(paramObj.id);
  }
}
