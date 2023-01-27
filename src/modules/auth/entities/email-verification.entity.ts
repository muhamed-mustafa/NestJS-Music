import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('verification-emails')
@Unique(['email', 'emailToken'])
export class EmailVerification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  emailToken: string;

  @Column({ default: new Date() })
  timestamp: Date;
}
