/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/apis/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  serializeUser(user: any, done: Function) {
    console.log('serializer', user);
    done(null, user);
  }

  async deserializeUser(payload: any, done: Function) {
    console.log('deserilizer', payload);
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
