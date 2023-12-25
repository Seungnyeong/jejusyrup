import { IsNotEmpty } from 'class-validator';
import { Blog } from 'src/blog/entities/blog.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateMediaDto {
  @IsNotEmpty()
  blog: Blog;

  @IsNotEmpty()
  user: User;

  files?: Express.Multer.File[];
}
