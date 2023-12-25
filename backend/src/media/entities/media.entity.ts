import { Blog } from 'src/blog/entities/blog.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
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
}
