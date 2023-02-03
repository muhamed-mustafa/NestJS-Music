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

  @Column({
    nullable: true,
  })
  gender: Gender;

  @Column({
    nullable: true,
  })
  age: number;

  @Column({
    nullable: true,
  })
  country: string;

  @Column({
    nullable: true,
  })
  city: string;

  @Column({
    nullable: true,
  })
  address: string;

  @Column({
    nullable: true,
  })
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
