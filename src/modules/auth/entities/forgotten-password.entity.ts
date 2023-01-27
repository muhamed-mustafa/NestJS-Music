import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('forgotten-password')
@Unique(['email', 'newPasswordToken'])
export class ForgottenPassword extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  newPasswordToken: string;

  @Column({ default: new Date() })
  timestamp: Date;
}
