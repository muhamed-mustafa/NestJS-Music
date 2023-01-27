import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { SongRepository } from './song.repository';
import { Song } from './entities/song.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterFields } from '../../common/interfaces/filter-fields';
import { CreateSongDto } from './dtos/create-song-dto';
import { mergeDeepRight } from 'ramda';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AwsService } from '../../shared/modules/aws/aws.service';
import { SingerAlbumService } from '../singer-album/singer-album.service';
import { UpdateSongDto } from './dtos/update-song-dto';
import { FavoriteService } from '../favorite/favorite.service';
import { TrackService } from '../track/track.service';
import { PlaylistService } from '../playlist/playlist.service';

const info = {
  alias: 'song',
  field: 'tracks',
  entity: 'track',
};

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(SongRepository)
    private songRepository: SongRepository,
    private awsService: AwsService,
    @Inject(forwardRef(() => SingerAlbumService))
    private singerAlbumService: SingerAlbumService,
    private favoriteService: FavoriteService,
    private trackService: TrackService,
    private playlistService: PlaylistService,
  ) {}

  async find(): Promise<Song[]> {
    return await this.songRepository.find({ relations: ['tracks'] });
  }

  async getByLimit(limit: number): Promise<Song[]> {
    return this.songRepository.getByLimit({
      ...info,
      ...(limit && { limit }),
    });
  }

  async filter({ limit, type, language, rate }: FilterFields): Promise<Song[]> {
    return await this.songRepository.filter({
      ...info,
      filterFields: {
        ...(limit && { limit }),
        ...(type && { type }),
        ...(language && {
          language,
        }),
        ...(rate && {
          rate,
        }),
      },
    });
  }

  async getById(id: number, isRelation: boolean = true): Promise<Song> {
    const song = await this.songRepository.findOne({
      where: {
        id,
      },

      ...(isRelation && { relations: ['tracks'] }),
    });

    if (!song) throw new NotFoundException(`Song with this id ${id} not found`);

    return song;
  }

  async create(data: CreateSongDto, singerAlbumId: number): Promise<Song> {
    const singerAlbum = await this.singerAlbumService.getById(singerAlbumId);

    const { Location } = await this.awsService.fileUpload(
      data.source as any,
      'song',
    );

    data.source = Location;
    return this.songRepository.save(
      this.songRepository.create({
        ...data,
        tempImage: singerAlbum.image,
        singerAlbum,
      }),
    );
  }

  async update(id: number, data: UpdateSongDto): Promise<UpdateResult> {
    const song = await this.getById(id, false);

    if (data.source) {
      await this.awsService.deleteFile(song.source);
      const { Location } = await this.awsService.fileUpload(
        data.source as any,
        'song',
      );

      data.source = Location;
    }

    const mergeUpdateSong = mergeDeepRight(song, data);
    return await this.songRepository.update(id, mergeUpdateSong);
  }

  async delete(id: number): Promise<DeleteResult> {
    const song = await this.getById(id);
    if (song.source) await this.awsService.deleteFile(song.source);
    song.tracks.map(async (song) => await this.trackService.delete(song.id));
    return await this.songRepository.delete(id);
  }

  async pushSongToFavorite(id: number, favoriteId: number) {
    const song = await this.getById(id);
    return await this.favoriteService.createFavoriteTrack({
      song,
      favoriteId,
    });
  }

  async pushSongToPlaylist(id: number, playlistId: number) {
    const song = await this.getById(id);
    return await this.playlistService.createPlayListTrack({
      song,
      playlistId,
    });
  }
}
