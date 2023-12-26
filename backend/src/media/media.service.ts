import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media, MediaType } from 'src/media/entities/media.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Transactional } from 'typeorm-transactional';
import {
  convertGPSToCoordinates,
  getGPSData,
} from 'src/common/util/photo.util';
@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private readonly medias: Repository<Media>,
    private readonly configService: ConfigService, // ConfigService 주입
  ) {}
  @Transactional()
  async create(createMediaDto: CreateMediaDto): Promise<Media[]> {
    try {
      const medias = createMediaDto.files.map(async (file) => {
        let clatitude: number = null;
        let clongitude: number = null;
        if (file.mimetype.startsWith('image')) {
          const gpsData = await getGPSData(file.path);
          if (gpsData) {
            const { latitude, longitude } = convertGPSToCoordinates(gpsData);
            clatitude = latitude;
            clongitude = longitude;
          }
        }
        return await this.medias.save(
          this.medias.create({
            blog: createMediaDto.blog,
            media_name: file.originalname,
            media_path: file.path,
            media_url: `${this.configService.get<string>('STORAGE_URL')}/${
              file.filename
            }`,
            media_type: file.mimetype.startsWith('image')
              ? MediaType.Photo
              : MediaType.Video,
            coordinates: {
              latitude: clatitude,
              longitude: clongitude,
            },
          }),
        );
      });
      return Promise.all(medias);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return `This action returns all media`;
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
