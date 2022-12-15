import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';

@Module({ imports: [TypeOrmModule.forFeature([Song])] })
export class SongModule {}
