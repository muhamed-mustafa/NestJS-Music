import { Injectable, NotFoundException } from '@nestjs/common';
import { Playlist } from './entities/playlist.entity';
import { User } from '../user/entities/user.entity';
import { PlaylistRepository } from './playlist.repository';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PlayListDto } from './dtos/create-playlist-dto';
import { Song } from '../song/entities/song.entity';
import { Music } from '../music/entities/music.entity';
import { TrackService } from '../track/track.service';
import { mergeDeepRight } from 'ramda';
import { Track } from '../track/entities/track.entity';

@Injectable()
export class PlaylistService {
  constructor(
    private playlistRepository: PlaylistRepository,
    private trackService: TrackService,
  ) {}

  async getUserPlaylists({ id }: User): Promise<Playlist[]> {
    return await this.playlistRepository.getUserPlaylists(id);
  }

  async get(id: number, isRelation: boolean = true): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: {
        id,
      },

      ...(isRelation && { relations: ['tracks'] }),
    });

    if (!playlist)
      throw new NotFoundException(`Playlist with Id ${id} not found`);

    return playlist;
  }

  async create(user: User, data: PlayListDto): Promise<Playlist> {
    return await this.playlistRepository.save(
      this.playlistRepository.create({
        ...data,
        user,
        tracks: [],
      }),
    );
  }

  async update(id: number, data: PlayListDto): Promise<UpdateResult> {
    const playlist = await this.get(id, false);
    const mergeUpdatePlaylist = mergeDeepRight(playlist, data);
    return await this.playlistRepository.update(id, mergeUpdatePlaylist);
  }

  async delete(id: number): Promise<DeleteResult> {
    await this.clearPlayList(id);
    return await this.playlistRepository.delete(id);
  }

  async clearPlayList(id: number): Promise<Playlist> {
    const playlist = await this.get(id);

    playlist.tracks.map(
      async (playlist) => await this.trackService.delete(playlist.id),
    );
    playlist.tracks = [];

    return await playlist.save();
  }

  async removeTrackFromPlayList(id: number, trackId: number) {
    const playlist = await this.get(id);

    playlist.tracks.map(async (_track, i) => {
      if (playlist.tracks[i].id === trackId) {
        await this.trackService.delete(trackId);
        playlist.tracks.splice(i, 1);
      }
    });

    await playlist.save();
  }

  async createPlayListTrack({
    song,
    music,
    playlistId,
  }: {
    song?: Song;
    music?: Music;
    playlistId: number;
  }): Promise<Track> {
    const playlist = await this.get(playlistId);
    return this.trackService.pushToPlayList({ song, music, playlist });
  }
}
