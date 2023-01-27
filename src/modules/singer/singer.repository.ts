import { Singer } from './entities/singer.entity';
import { CustomRepository } from '../../common/decorators/custom-repository-decorator';
import { BaseRepository } from '../../common/repositories/base-repository';

@CustomRepository(Singer)
export class SingerRepository extends BaseRepository<Singer> {}
