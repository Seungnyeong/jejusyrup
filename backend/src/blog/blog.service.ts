import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from 'src/blog/entities/blog.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMediaDto } from 'src/media/dto/create-media.dto';
import { MediaService } from 'src/media/media.service';
import { Media } from 'src/media/entities/media.entity';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private readonly blogs: Repository<Blog>,
    private readonly mediaService: MediaService,
  ) {}

  @Transactional()
  async create(
    createBlogDto: CreateBlogDto,
    files: Express.Multer.File[],
  ): Promise<[Blog, Media[]]> {
    try {
      const blog = await this.blogs.save(this.blogs.create(createBlogDto));
      const media = await this.mediaService.create({
        blog: blog,
        user: createBlogDto.user,
        files,
      });
      return Promise.all([blog, media]);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return `This action returns all blog`;
  }

  async findOne(id: number): Promise<Blog | undefined> {
    try {
      return await this.blogs.findOneOrFail({
        where: {
          id: id,
        },
      });
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
