import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicianAlbum } from './entities/musician-album.entity';
import { MusicianAlbumController } from './musician-album.controller';
import { AwsModule } from '../../shared/modules/aws/aws.module';
import { MusicianAlbumService } from './musician-album.service';
import { MusicModule } from '../music/music.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MusicianAlbum]),
    AwsModule,
    forwardRef(() => MusicModule),
  ],
  controllers: [MusicianAlbumController],
  providers: [MusicianAlbumService],
  exports: [MusicianAlbumService],
})
export class MusicianAlbumModule {}
