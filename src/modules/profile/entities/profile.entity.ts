import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToOne,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { Gender } from 'src/common/enums/gender.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { Favorite } from 'src/modules/favorite/entities/favorite.entity';

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

  @Column({
    nullable: true,
  })
  image: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @OneToOne(() => Favorite, (favorite) => favorite.profile)
  @JoinColumn()
  favorite: Favorite;

  @Column()
  favoriteId: number;
}
