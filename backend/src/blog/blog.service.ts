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

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private readonly blogs: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    try {
      return await this.blogs.save(this.blogs.create(createBlogDto));
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
