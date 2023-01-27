import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { MusicRepository } from './music.repository';
import { Music } from './entities/music.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterFields } from '../../common/interfaces/filter-fields';
import { CreateMusicDto } from './dto/create-music-dto';
import { mergeDeepRight } from 'ramda';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AwsService } from '../../shared/modules/aws/aws.service';
import { MusicianAlbumService } from '../musician-album/musician-album.service';
import { updateMusicDto } from './dto/update-music-dto';
import { FavoriteService } from '../favorite/favorite.service';
import { TrackService } from '../track/track.service';
import { PlaylistService } from '../playlist/playlist.service';

const info = {
  alias: 'music',
  field: 'tracks',
  entity: 'track',
};

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(MusicRepository)
    private musicRepository: MusicRepository,
    @Inject(forwardRef(() => MusicianAlbumService))
    private musicianAlbumService: MusicianAlbumService,
    private awsService: AwsService,
    private favoriteService: FavoriteService,
    private trackService: TrackService,
    private playlistService: PlaylistService,
  ) {}

  async find(): Promise<Music[]> {
    return await this.musicRepository.find({ relations: ['tracks'] });
  }

  async getByLimit(limit: number): Promise<Music[]> {
    return this.musicRepository.getByLimit({
      ...info,
      ...(limit && { limit }),
    });
  }

  async filter({ limit, type, rate }: FilterFields): Promise<Music[]> {
    return await this.musicRepository.filter({
      ...info,
      filterFields: {
        ...(limit && { limit }),
        ...(type && { type }),
        ...(rate && {
          rate,
        }),
      },
    });
  }

  async getById(id: number, isRelation: boolean = true): Promise<Music> {
    const music = await this.musicRepository.findOne({
      where: {
        id,
      },

      ...(isRelation && { relations: ['tracks'] }),
    });

    if (!music)
      throw new NotFoundException(`Music with this id ${id} not found`);

    return music;
  }

  async create(data: CreateMusicDto, musicianAlbumId: number): Promise<Music> {
    const musicianAlbum = await this.musicianAlbumService.getById(
      musicianAlbumId,
    );

    const { Location } = await this.awsService.fileUpload(
      data.source as any,
      'musics',
    );

    data.source = Location;
    return this.musicRepository.save(
      this.musicRepository.create({
        ...data,
        tempImage: musicianAlbum.image,
        musicianAlbum,
      }),
    );
  }

  async update(id: number, data: updateMusicDto): Promise<UpdateResult> {
    const music = await this.getById(id, false);

    if (data.source) {
      await this.awsService.deleteFile(music.source);
      const { Location } = await this.awsService.fileUpload(
        data.source as any,
        'musics',
      );

      data.source = Location;
    }

    const mergeUpdateMusic = mergeDeepRight(music, data);
    return await this.musicRepository.update(id, mergeUpdateMusic);
  }

  async delete(id: number): Promise<DeleteResult> {
    const music = await this.getById(id);

    if (music.source) await this.awsService.deleteFile(music.source);
    music.tracks.map(async (song) => await this.trackService.delete(song.id));

    return await this.musicRepository.delete(id);
  }

  async pushMusicToFavorite(id: number, favoriteId: number) {
    const music = await this.getById(id);
    return await this.favoriteService.createFavoriteTrack({
      music,
      favoriteId,
    });
  }

  async pushMusicToPlayList(id: number, playlistId: number) {
    const music = await this.getById(id);
    return await this.playlistService.createPlayListTrack({
      music,
      playlistId,
    });
  }
}
