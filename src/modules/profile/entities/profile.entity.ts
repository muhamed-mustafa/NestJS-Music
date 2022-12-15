import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToOne,
  BaseEntity,
} from 'typeorm';
import { Gender } from 'src/common/enums/gender.enum';
import { User } from 'src/modules/auth/entities/user.entity';
import { Favorite } from 'src/modules/favorite/favorite.entity';

@Entity('profiles')
@Unique(['phone'])
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  gender: Gender;

  @Column()
  age: number;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @OneToOne((type) => User, (user) => user.profile)
  user: User;

  @OneToOne((type) => Favorite, (favorite) => favorite.profile)
  favorite: Favorite;

  @Column()
  favoriteId: number;
}
