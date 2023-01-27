import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from './entities/track.entity';
import { Repository } from 'typeorm';
import { HttpCode } from '@nestjs/common/decorators';

@Controller('tracks')
export class TrackController {
  constructor(
    @InjectRepository(Track) private trackRepository: Repository<Track>,
  ) {}

  @HttpCode(200)
  @Get()
  async getTracks(): Promise<Track[]> {
    return await this.trackRepository.find();
  }
}
