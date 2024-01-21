import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from 'src/apis/blog/entities/blog.entity';
import { Media } from 'src/apis/media/entities/media.entity';
import { MediaService } from 'src/apis/media/media.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { extname, join } from 'path';
import { checkFileType } from 'src/common/validation/file.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, Media]),
    MulterModule.register({
      storage: diskStorage({
        destination(req, file, callback) {
          const configService = new ConfigService();
          let destPath = configService.get<string>('MULTER_DEST');

          if (file.mimetype.startsWith('image/')) {
            destPath = join(configService.get<string>('MULTER_DEST'), 'images');
          } else if (file.mimetype.startsWith('video/')) {
            destPath = join(configService.get<string>('MULTER_DEST'), 'videos');
          }

          // Set the destination path
          callback(null, destPath);
        },
        filename(req, file, callback) {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 1024,
        files: 10,
      },
      fileFilter(req, file, callback) {
        checkFileType(file, callback);
      },
    }),
  ],
  controllers: [BlogController],
  providers: [BlogService, MediaService],
})
export class BlogModule {}
