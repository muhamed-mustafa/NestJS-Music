import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SongService } from '../song/song.service';
import { SingerAlbum } from './entities/singer-album.entity';
import { mergeDeepRight } from 'ramda';
import { DeleteResult, UpdateResult, Repository } from 'typeorm';
import { CreateAlbumDto } from 'src/shared/dtos/create-album-dto';
import { SingerService } from '../singer/singer.service';

@Injectable()
export class SingerAlbumService {
  constructor(
    @InjectRepository(SingerAlbum)
    private singerAlbumRepository: Repository<SingerAlbum>,
    @Inject(forwardRef(() => SongService))
    private songService: SongService,
    private singerService: SingerService,
  ) {}

  async find(): Promise<SingerAlbum[]> {
    return await this.singerAlbumRepository.find({ relations: ['songs'] });
  }

  async getById(id: number, isRelation: boolean = true): Promise<SingerAlbum> {
    const singerAlbum = await this.singerAlbumRepository.findOne({
      where: {
        id,
      },
      ...(isRelation && { relations: ['songs'] }),
    });

    if (!singerAlbum)
      throw new NotFoundException(`singerAlbum with this id ${id} not found`);

    return singerAlbum;
  }

  async createNewAlbum(
    { name }: CreateAlbumDto,
    singerId: number,
  ): Promise<SingerAlbum> {
    const singer = await this.singerService.getById(singerId);

    return await this.singerAlbumRepository.save(
      this.singerAlbumRepository.create({
        name,
        singer,
        image: singer.image,
      }),
    );
  }

  async update(id: number, data: CreateAlbumDto): Promise<UpdateResult> {
    const singerAlbum = await this.getById(id, false);
    const mergeUpdateSingerAlbum = mergeDeepRight(singerAlbum, data);
    return await this.singerAlbumRepository.update(id, mergeUpdateSingerAlbum);
  }

  async delete(id: number): Promise<DeleteResult> {
    const singerAlbum = await this.getById(id);

    const [, result] = await Promise.all([
      singerAlbum.songs.map(async (song) => {
        return await this.songService.delete(song.id);
      }),

      await this.singerAlbumRepository.delete(id),
    ]);

    return result;
  }

  async clearSingerAlbum(id: number): Promise<SingerAlbum> {
    const singerAlbum = await this.getById(id);

    singerAlbum.songs.map(async (song) => {
      return await this.songService.delete(song.id);
    }),
      (singerAlbum.songs = []);

    return await singerAlbum.save();
  }
}
