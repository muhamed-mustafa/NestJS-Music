import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Role } from 'src/common/enums/role.enum';
import * as bcrypt from 'bcryptjs';
import { CustomRepository } from '../../../common/decorators/custom-repository-decorator';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.findOne({ where: { username } });
  }

  async checkIsAdmin(user: User): Promise<Boolean> {
    return user.role === Role.ADMIN;
  }

  async validateUserPassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user || !(await this.comparePassword(password, user.password))) {
      throw new NotFoundException('Invalid Email Or Password');
    }
    return user;
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(
    currentPassword: string,
    password: string,
  ): Promise<boolean> {
    return await bcrypt.compare(currentPassword, password);
  }

  async generateSalt(salt: number): Promise<string> {
    return await bcrypt.genSalt(salt);
  }

  async checkUsername(username: string): Promise<boolean> {
    const query = this.createQueryBuilder('user').select('username');
    query.where('user.username LIKE :username', { username });
    return (await query.getCount()) >= 1;
  }

  async checkEmail(email: string): Promise<boolean> {
    const query = this.createQueryBuilder('user').select('email');
    query.where('user.email LIKE :email', { email });
    return (await query.getCount()) >= 1;
  }
}
