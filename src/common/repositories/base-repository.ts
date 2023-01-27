import { Repository, Entity, ObjectLiteral } from 'typeorm';
import { CustomRepository } from '../decorators/custom-repository-decorator';
import { FilterFields } from '../interfaces/filter-fields';

@CustomRepository(Entity)
export class BaseRepository<
  Entity extends ObjectLiteral,
> extends Repository<Entity> {
  async getByLimit(args: {
    alias: string;
    field: string;
    entity: string;
    limit?: number;
  }): Promise<Entity[]> {
    const query = this.createQueryBuilder(args.alias).select();

    if (args.limit) query.limit(args.limit);

    return await query
      .leftJoinAndSelect(`${args.alias}.${args.field}`, args.entity)
      .getMany();
  }

  async filter(args: {
    alias: string;
    field: string;
    entity: string;
    filterFields?: FilterFields;
  }): Promise<Entity[]> {
    const { limit, type, language, rate, gender, nationality } =
      args.filterFields;

    const query = this.createQueryBuilder(args.alias).select();

    if (limit) query.limit(limit);

    if (type) query.andWhere(`${args.alias}.type = :type`, { type });

    if (rate) query.andWhere(`${args.alias}.rate = :rate`, { rate });

    if (gender) query.andWhere(`${args.alias}.gender = :gender`, { gender });

    if (language) {
      query.andWhere(`${args.alias}.language = :language`, { language });
    }

    if (nationality) {
      query.andWhere(`${args.alias}.nationality LIKE :nationality`, {
        nationality,
      });
    }

    return await query
      .leftJoinAndSelect(`${args.alias}.${args.field}`, args.entity)
      .getMany();
  }
}
