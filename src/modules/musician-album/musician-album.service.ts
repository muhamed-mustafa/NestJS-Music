import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateAlbumDto } from 'src/shared/dtos/create-album-dto';
import { MusicianAlbum } from './entities/musician-album.entity';
import { MusicService } from '../music/music.service';
import { mergeDeepRight } from 'ramda';
import { MusicianService } from '../musician/musician.service';

@Injectable()
export class MusicianAlbumService {
  constructor(
    @InjectRepository(MusicianAlbum)
    private musicianAlbumRepository: Repository<MusicianAlbum>,
    @Inject(forwardRef(() => MusicService))
    private musicService: MusicService,
    private musicianService: MusicianService,
  ) {}

  async find(): Promise<MusicianAlbum[]> {
    return await this.musicianAlbumRepository.find({ relations: ['musics'] });
  }

  async getById(
    id: number,
    isRelation: boolean = true,
  ): Promise<MusicianAlbum> {
    const musicianAlbum = await this.musicianAlbumRepository.findOne({
      where: {
        id,
      },

      ...(isRelation && { relations: ['musics'] }),
    });

    if (!musicianAlbum)
      throw new NotFoundException(`musicianAlbum with this id ${id} not found`);

    return musicianAlbum;
  }

  async createNewAlbum(
    { name }: CreateAlbumDto,
    musicianId: number,
  ): Promise<MusicianAlbum> {
    const musician = await this.musicianService.getById(musicianId);

    return await this.musicianAlbumRepository.save(
      this.musicianAlbumRepository.create({
        name,
        musician,
        image: musician.image,
        musics: [],
      }),
    );
  }

  async update(id: number, data: CreateAlbumDto): Promise<UpdateResult> {
    const musicianAlbum = await this.getById(id, false);

    const mergeUpdateMusicianAlbum = mergeDeepRight(musicianAlbum, data);
    return await this.musicianAlbumRepository.update(
      id,
      mergeUpdateMusicianAlbum,
    );
  }

  async delete(id: number): Promise<DeleteResult> {
    const musicianAlbum = await this.getById(id);

    const [, result] = await Promise.all([
      musicianAlbum.musics.map(async (music) => {
        return await this.musicService.delete(music.id);
      }),

      await this.musicianAlbumRepository.delete(id),
    ]);

    return result;
  }
}
