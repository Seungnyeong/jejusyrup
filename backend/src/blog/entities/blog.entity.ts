import { CoreEntity } from 'src/common/entities/core.entity';
import { Media } from 'src/media/entities/media.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Geometry } from 'geojson';

@Entity()
export class Blog extends CoreEntity {
  @Column()
  title: string;

  @ManyToOne((type) => User, (user) => user.blogs)
  user: User;

  @OneToMany((type) => Media, (media) => media.blog, { cascade: true })
  medias: Media[];

  @Column({
    name: 'location',
    type: 'point',
    srid: 5186,
    nullable: true,
    comment: 'geom',
  })
  location: Geometry;
}
