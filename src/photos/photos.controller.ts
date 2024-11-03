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
  UseGuards,
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
import { AuthGaurd } from 'src/auth/guards/auth.guard';
import { Role } from 'src/users/roles.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { existsSync, mkdir, mkdirSync } from 'fs';
@Controller('photos')
export class PhotosController {
  constructor(private photosService: PhotosService) {}

  // @UseGuards(RolesGuard)
  // @Roles(Role.Admin)
  // @UseGuards(AuthGaurd)
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

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Post('')
  @UseInterceptors(
    FilesInterceptor('photos', 10, {
      storage: diskStorage({
        destination: (req,file,callback)=>{
          const uploadPath='./uploads/media';

          if(!existsSync(uploadPath)){
            mkdirSync(uploadPath,{recursive:true});
          }
          callback(null,uploadPath);
        },
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

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Post('/main')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination:  (req,file,callback)=>{
          const uploadPath='./uploads/media';

          if(!existsSync(uploadPath)){
            mkdirSync(uploadPath,{recursive:true});
          }
          callback(null,uploadPath);
        },
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
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Delete(':id')
  async deletePhoto(@Param() paramObj: PhotoIdDTO) {
    return await this.photosService.deletePhoto(paramObj.id);
  }
}
