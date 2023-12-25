import { IsNotEmpty } from 'class-validator';
import { CreateMediaDto } from 'src/media/dto/create-media.dto';
import { User } from 'src/users/entities/user.entity';
import { Geometry } from 'typeorm';

export class CreateBlogDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  user: User;

  location?: Geometry;
}
