import { Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { MusicianRepository } from './musician.repository';
import { Musician } from './entities/musician.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterFields } from '../../common/interfaces/filter-fields';
import { CreateMusicianDto } from './dtos/create-musician-dto';
import { mergeDeepRight } from 'ramda';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AwsService } from '../../shared/modules/aws/aws.service';
import { UpdateMusicianDto } from './dtos/update-musician-dto';
import { MusicianAlbumService } from '../musician-album/musician-album.service';
import { Inject } from '@nestjs/common/decorators';

const info = {
  alias: 'musician',
  field: 'musicianAlbums',
  entity: 'musician-album',
};

@Injectable()
export class MusicianService {
  constructor(
    @InjectRepository(MusicianRepository)
    private musicianRepository: MusicianRepository,
    private awsService: AwsService,
    @Inject(forwardRef(() => MusicianAlbumService))
    private musicianAlbumService: MusicianAlbumService,
  ) {}

  async find(): Promise<Musician[]> {
    return await this.musicianRepository.find({
      relations: ['musicianAlbums'],
    });
  }

  async getByLimit(limit: number): Promise<Musician[]> {
    return this.musicianRepository.getByLimit({
      ...info,
      ...(limit && { limit }),
    });
  }

  async filter({
    limit,
    type,
    nationality,
    gender,
  }: FilterFields): Promise<Musician[]> {
    return await this.musicianRepository.filter({
      ...info,
      filterFields: {
        ...(limit && { limit }),
        ...(type && { type }),
        ...(nationality && {
          nationality,
        }),
        ...(gender && {
          gender,
        }),
      },
    });
  }

  async getById(id: number, isRelation: boolean = true): Promise<Musician> {
    const musician = await this.musicianRepository.findOne({
      where: {
        id,
      },

      ...(isRelation && { relations: ['musicianAlbums'] }),
    });

    if (!musician)
      throw new NotFoundException(`Musician with this id ${id} not found`);

    return musician;
  }

  async create(data: CreateMusicianDto): Promise<Musician> {
    const { Location } = await this.awsService.fileUpload(
      data.image as any,
      'musician',
    );

    data.image = Location;
    return this.musicianRepository.save(this.musicianRepository.create(data));
  }

  async update(id: number, data: UpdateMusicianDto): Promise<UpdateResult> {
    const music = await this.getById(id, false);

    if (data.image) {
      await this.awsService.deleteFile(music.image);
      const { Location } = await this.awsService.fileUpload(
        data.image as any,
        'musician',
      );

      data.image = Location;
    }

    const mergeUpdateMusician = mergeDeepRight(music, data);
    return await this.musicianRepository.update(id, mergeUpdateMusician);
  }

  async delete(id: number): Promise<DeleteResult> {
    const musician = await this.getById(id);

    if (musician.image) await this.awsService.deleteFile(musician.image);
    musician.musicianAlbums.map(
      async (album) => await this.musicianAlbumService.delete(album.id),
    );

    return await this.musicianRepository.delete(id);
  }
}
