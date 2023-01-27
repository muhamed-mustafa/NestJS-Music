import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from './entities/track.entity';
import { Song } from '../song/entities/song.entity';
import { Music } from '../music/entities/music.entity';
import { Favorite } from '../favorite/entities/favorite.entity';
import { Playlist } from '../playlist/entities/playlist.entity';
import { Repository, DeleteResult } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track) private trackRepository: Repository<Track>,
  ) {}

  async pushToFavoriteList({
    song,
    favorite,
    music,
  }: {
    song: Song;
    music: Music;
    favorite: Favorite;
  }): Promise<Track> {
    const track = await this.checkTrackType(song, music);
    track.favorite = favorite;
    return await track.save();
  }

  async pushToPlayList({
    song,
    playlist,
    music,
  }: {
    song: Song;
    music: Music;
    playlist: Playlist;
  }): Promise<Track> {
    const track = await this.checkTrackType(song, music);
    track.playlist = playlist;
    return await track.save();
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.trackRepository.delete(id);
  }

  async checkTrackType(song: Song, music: Music): Promise<Track> {
    if (song) {
      return await this.trackRepository.save(
        this.trackRepository.create({
          song,
          title: song.name,
          link: song.source,
        }),
      );
    }

    if (music) {
      return await this.trackRepository.save(
        this.trackRepository.create({
          music,
          title: music.name,
          link: music.source,
        }),
      );
    }
  }
}
