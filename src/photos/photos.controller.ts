import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { AsignPhotosDTO } from './dtos/asign-photo.dto';
@Controller('photos')
export class PhotosController {
  @Post()
  @UseInterceptors(
    FileInterceptor('photos', {
      storage: diskStorage({
        destination: './uploads/media',
        filename: (req, file, callback) => {
          const filename = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async asignPhotosToProudct(@Body() asignPhotoDto:object,@UploadedFiles() photos:Array<Express.Multer.File>) {
    console.log(asignPhotoDto);
    console.log('****************');
    console.log(photos);
  }
}
