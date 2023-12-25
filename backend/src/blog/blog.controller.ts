import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { MediaService } from 'src/media/media.service';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'src/common/dtos/response.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('blog')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly mediaService: MediaService,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image[]', maxCount: 10 },
      { name: 'video[]', maxCount: 10 },
    ]),
  )
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFiles()
    files: {
      'image[]': Express.Multer.File[];
      'video[]': Express.Multer.File[];
    },
    user: User,
  ): Promise<Response> {
    const imageFiles = Array.isArray(files['image[]']) ? files['image[]'] : [];
    const videoFiles = Array.isArray(files['video[]']) ? files['video[]'] : [];
    const blog = await this.blogService.create(createBlogDto);
    const media = await this.mediaService.create({
      blog: blog,
      files: [...imageFiles, ...videoFiles].flat(),
      user: user,
    });

    return {
      success: true,
      message: '게시글 등록에 성공하였습다.',
      data: {
        ...blog,
        media: media,
      },
    };
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
