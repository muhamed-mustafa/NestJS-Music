import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Singer } from './singer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Singer])],
})
export class SingerModule {}
