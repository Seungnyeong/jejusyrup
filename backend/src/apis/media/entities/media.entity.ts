import { Blog } from 'src/apis/blog/entities/blog.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Coordinates } from 'src/interface/country.interface';
import { User } from 'src/apis/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum MediaType {
  Video = 'Video',
  Photo = 'Photo',
}

@Entity()
export class Media extends CoreEntity {
  @Column({ type: 'enum', enum: MediaType })
  media_type: MediaType;

  @Column()
  media_name: string;

  @Column()
  media_path: string;

  @Column()
  media_url: string;

  @ManyToOne((type) => User, (user) => user.medias)
  user: User;

  @ManyToOne((type) => Blog, (blog) => blog.id)
  blog: Blog;

  @Column({ name: 'coordinates', type: 'json', nullable: true })
  coordinates: Coordinates;
}
