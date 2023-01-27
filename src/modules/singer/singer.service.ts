import { Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { SingerRepository } from './singer.repository';
import { Singer } from './entities/singer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterFields } from '../../common/interfaces/filter-fields';
import { CreateSingerDto } from './dtos/create-singer-dto';
import { mergeDeepRight } from 'ramda';
import { DeleteResult, UpdateResult } from 'typeorm';
import { unlinkSync } from 'fs';
import { UpdateSingerDto } from './dtos/update-singer-dto';
import { SingerAlbumService } from '../singer-album/singer-album.service';
import { Inject } from '@nestjs/common/decorators';

const info = {
  alias: 'singer',
  field: 'singerAlbums',
  entity: 'singer-albums',
};

@Injectable()
export class SingerService {
  constructor(
    @InjectRepository(SingerRepository)
    private singerRepository: SingerRepository,
    @Inject(forwardRef(() => SingerAlbumService))
    private singerAlbumService: SingerAlbumService,
  ) {}

  async find(): Promise<Singer[]> {
    return await this.singerRepository.find();
  }

  async getByLimit(limit: number): Promise<Singer[]> {
    return this.singerRepository.getByLimit({
      ...info,
      ...(limit && { limit }),
    });
  }

  async filter({
    limit,
    type,
    gender,
    language,
    nationality,
  }: FilterFields): Promise<Singer[]> {
    return await this.singerRepository.filter({
      ...info,
      filterFields: {
        ...(limit && { limit }),
        ...(type && { type }),
        ...(language && {
          language,
        }),
        ...(gender && { gender }),
        ...(nationality && { nationality }),
      },
    });
  }

  async getById(id: number): Promise<Singer> {
    const singer = await this.singerRepository.findOne({
      where: {
        id,
      },
    });

    if (!singer)
      throw new NotFoundException(`Singer with this id ${id} not found`);

    return singer;
  }

  async create(data: CreateSingerDto): Promise<Singer> {
    return this.singerRepository.save(this.singerRepository.create(data));
  }

  async update(id: number, data: UpdateSingerDto): Promise<UpdateResult> {
    const singer = await this.getById(id);
    if (data.image) unlinkSync(data.image);

    const mergeUpdateSinger = mergeDeepRight(singer, data);
    return await this.singerRepository.update(id, mergeUpdateSinger);
  }

  async delete(id: number): Promise<DeleteResult> {
    const singer = await this.getById(id);

    if (singer.image) unlinkSync(singer.image);
    singer.singerAlbums.map(
      async (album) => await this.singerAlbumService.delete(album.id),
    );

    return await this.singerRepository.delete(id);
  }
}
