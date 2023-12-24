/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  serializeUser(user: any, done: Function) {
    done(null, user);
  }

  async deserializeUser(payload: any, done: Function) {
    console.log(payload);
    return await this.userRepository
      .findOneOrFail({
        where: {
          id: payload.id,
        },
      })
      .then((user) => {
        done(null, user);
      })
      .catch((err) => done(err));
  }
}
