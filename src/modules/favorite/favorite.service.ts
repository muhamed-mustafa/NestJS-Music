import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { CreateProfileDto } from '../profile/dtos/create-profile-dto';
import { TrackService } from '../track/track.service';
import { Music } from '../music/entities/music.entity';
import { Song } from '../song/entities/song.entity';
import { Track } from '../track/entities/track.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private FavoriteRepository: Repository<Favorite>,
    private trackService: TrackService,
  ) {}

  async createFavoriteList(profile: CreateProfileDto) {
    return await this.FavoriteRepository.save(
      this.FavoriteRepository.create({
        profile,
        tracks: [],
      }),
    );
  }

  async getFavoriteList(id: number): Promise<Favorite> {
    return await this.FavoriteRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deleteFavoriteList(id: number): Promise<DeleteResult> {
    await this.clearFavoriteList(id);
    return await this.FavoriteRepository.delete(id);
  }

  async clearFavoriteList(id: number): Promise<Favorite> {
    const favorite = await this.getFavoriteList(id);

    favorite.tracks.map(
      async (favorite) => await this.trackService.delete(favorite.id),
    );

    favorite.tracks = [];
    return await favorite.save();
  }

  async removeTrackFromFavoriteList(
    id: number,
    trackId: number,
  ): Promise<Favorite> {
    const favorite = await this.getFavoriteList(id);

    favorite.tracks.map(async (_track, i) => {
      if (favorite.tracks[i].id === trackId) {
        await this.trackService.delete(trackId);
        favorite.tracks.splice(i, 1);
      }
    });

    return await favorite.save();
  }

  async createFavoriteTrack({
    song,
    music,
    favoriteId,
  }: {
    song?: Song;
    music?: Music;
    favoriteId: number;
  }): Promise<Track> {
    const favorite = await this.getFavoriteList(favoriteId);
    return this.trackService.pushToFavoriteList({ song, music, favorite });
  }
}
