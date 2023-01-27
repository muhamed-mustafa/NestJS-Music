import { Musician } from './entities/musician.entity';
import { CustomRepository } from '../../common/decorators/custom-repository-decorator';
import { BaseRepository } from '../../common/repositories/base-repository';

@CustomRepository(Musician)
export class MusicianRepository extends BaseRepository<Musician> {}
