import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { AsignPhotosDTO } from './dtos/asign-photo.dto';
@Controller('photos')
export class PhotosController {
  @Post('')
  @UseInterceptors(FilesInterceptor('photos',10, {
    storage: diskStorage({
      destination:'./uploads/media'
      ,
      filename: (req, file, callback) => {
        const filename = `${uuidv4()}${extname(file.originalname)}`;
        callback(null, filename);
      },
    }),

  }))
  uploadFile(@Body()body:AsignPhotosDTO,@UploadedFiles() photos: Array<Express.Multer.File>) {
    // console.log(photos);
    // console.log(body);
  }
}
