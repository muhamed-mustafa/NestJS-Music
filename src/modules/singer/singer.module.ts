import { Module, forwardRef } from '@nestjs/common';
import { SingerRepository } from './singer.repository';
import { SingerController } from './singer.controller';
import { SingerService } from './singer.service';
import { TypeOrmExModule } from 'src/common/modules/typeorm-module';
import { SingerAlbumModule } from '../singer-album/singer-album.module';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../common/constants/auth-constants';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([SingerRepository]),
    forwardRef(() => SingerAlbumModule),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
  ],
  controllers: [SingerController],
  providers: [SingerService],
  exports: [SingerService],
})
export class SingerModule {}
