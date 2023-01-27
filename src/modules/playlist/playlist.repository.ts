import { Mixin } from 'ts-mixer';
import { Repository } from 'typeorm';
import { Playlist } from './entities/playlist.entity';
import { CustomRepository } from '../../common/decorators/custom-repository-decorator';
import { BaseRepository } from '../../common/repositories/base-repository';

@CustomRepository(Playlist)
export class PlaylistRepository extends Mixin(
  Repository<Playlist>,
  BaseRepository<Playlist>,
) {
  async getUserPlaylists(userId: number): Promise<Playlist[]> {
    const query = this.createQueryBuilder('playlist').select();
    if (!userId) return;

    query.where('playlist.userId = :userId', { userId });
    return await query.leftJoinAndSelect('playlist.tracks', 'track').getMany();
  }
}
