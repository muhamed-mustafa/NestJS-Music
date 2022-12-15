import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Musician } from './musician.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Musician])],
})
export class MusicianModule {}
