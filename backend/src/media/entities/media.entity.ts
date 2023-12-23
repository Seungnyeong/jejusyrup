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
  mediatype: MediaType;

  @Column()
  mediaName: string;

  @Column()
  mediaPath: string;

  @ManyToOne((type) => User, (user) => user.medias)
  user: User;
}
