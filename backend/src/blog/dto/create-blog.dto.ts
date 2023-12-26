import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Geometry } from 'typeorm';

export class CreateBlogDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  user: User;

  location?: Geometry;
}
