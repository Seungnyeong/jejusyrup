import { IsEnum } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Media } from 'src/media/entities/media.entity';
import { Blog } from 'src/blog/entities/blog.entity';
import { Country } from 'src/interface/country.interface';
export enum UserRole {
  Admin = 'Admin',
  Photographer = 'Photographer',
}

@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  nick_name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Photographer })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ name: 'country', type: 'json', nullable: true })
  country?: Country;

  @OneToMany(() => Media, (media) => media.id)
  medias: Media[];

  @OneToMany(() => Blog, (blog) => blog.id)
  blogs: Blog[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(input: string): Promise<boolean> {
    try {
      return await bcrypt.compare(input, this.password);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException();
    }
  }
}
