import { IsEnum } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Media } from 'src/media/entities/media.entity';
export enum UserRole {
  Admin = 'Admin',
  Photographer = 'Photograper',
}

@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  nick_name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Photographer })
  @IsEnum(UserRole)
  role: UserRole;

  @OneToMany(() => Media, (media) => media.id)
  medias: Media[];

  @BeforeInsert()
  @BeforeUpdate()
  async hasPassword(): Promise<void> {
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
