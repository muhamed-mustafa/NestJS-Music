import { Song } from './entities/song.entity';
import { CustomRepository } from '../../common/decorators/custom-repository-decorator';
import { BaseRepository } from '../../common/repositories/base-repository';

@CustomRepository(Song)
export class SongRepository extends BaseRepository<Song> {}
