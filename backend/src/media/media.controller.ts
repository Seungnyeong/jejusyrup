import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { User } from 'src/decorators/user.decorator';
import { BlogService } from 'src/blog/blog.service';
import {
  convertGPSToCoordinates,
  getGPSData,
} from 'src/common/util/photo.util';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly blogService: BlogService,
  ) {}

  @Post('upload/:blogId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image[]', maxCount: 10 },
      { name: 'video[]', maxCount: 10 },
    ]),
  )
  async uploadFile(
    @Param('blogId') blog_id: number,
    @UploadedFiles()
    files: {
      'image[]': Express.Multer.File[];
      'video[]': Express.Multer.File[];
    },
    @User() user,
  ) {
    const blog = await this.blogService.findOne(Number(blog_id));
    const imageFiles = Array.isArray(files['image[]']) ? files['image[]'] : [];
    const videoFiles = Array.isArray(files['video[]']) ? files['video[]'] : [];
    return this.mediaService.create({
      blog: blog,
      files: [...imageFiles, ...videoFiles].flat(),
      user,
    });
  }

  @Post('/test')
  @UseInterceptors(FileInterceptor('file'))
  async exif(@UploadedFile('file') file) {
    try {
      const gpsData = await getGPSData(file.path);
      if (gpsData) {
        const convertedCoordinates = convertGPSToCoordinates(gpsData);
        console.log('Converted Coordinates:', convertedCoordinates);
      }
      return { status: 'ok', gpsData };
    } catch (err) {
      console.error('Error:', err);
      return { status: 'error', error: err.message };
    }
  }

  @Get()
  findAll() {
    return this.mediaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(+id, updateMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
