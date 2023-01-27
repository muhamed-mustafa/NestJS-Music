import { Music } from './entities/music.entity';
import { CustomRepository } from '../../common/decorators/custom-repository-decorator';
import { BaseRepository } from '../../common/repositories/base-repository';

@CustomRepository(Music)
export class MusicRepository extends BaseRepository<Music> {}
