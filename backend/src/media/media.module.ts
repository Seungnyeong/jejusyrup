import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from 'src/media/entities/media.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { checkFileType } from 'src/common/validation/file.validator';
import { BlogService } from 'src/blog/blog.service';
import { Blog } from 'src/blog/entities/blog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, Blog]),
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
  controllers: [MediaController],
  providers: [MediaService, BlogService],
})
export class MediaModule {}
