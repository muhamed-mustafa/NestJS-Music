import { Module, forwardRef } from '@nestjs/common';
import { MusicianRepository } from './musician.repository';
import { MusicianService } from './musician.service';
import { AwsModule } from '../../shared/modules/aws/aws.module';
import { MusicianController } from './musician.controller';
import { TypeOrmExModule } from 'src/common/modules/typeorm-module';
import { MusicianAlbumModule } from '../musician-album/MusicianAlbumModule';
import { PassportModule } from '@nestjs/passport';
import { AuthConstants } from '../../common/constants/auth-constants';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([MusicianRepository]),
    AwsModule,
    forwardRef(() => MusicianAlbumModule),
    PassportModule.register({
      defaultStrategy: AuthConstants.strategies,
    }),
  ],
  controllers: [MusicianController],
  providers: [MusicianService],
  exports: [MusicianService],
})
export class MusicianModule {}
