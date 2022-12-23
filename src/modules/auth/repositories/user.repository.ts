import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from 'src/common/enums/role.enum';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { CustomRepository } from '../decorators/custom-repoistory';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.findOne({ where: { username } });
  }

  async checkIsAdmin(user: User): Promise<Boolean> {
    return user.roles.some((role) => role === Role.ADMIN);
  }

  async checkUser(user: User): Promise<User> {
    if (!user && !(await user.validatePassword(user.password)))
      throw new NotFoundException('Invalid Email Or Password');

    return user;
  }

  async validateUserPassword(loginDto: LoginDto): Promise<User> {
    const { email } = loginDto;
    const user = await this.findByEmail(email);
    return await this.checkUser(user);
  }

  async validateAdminPassword(loginDto: LoginDto): Promise<User> {
    const { email } = loginDto;
    const user = await this.findByEmail(email);

    const isAdmin = await this.checkIsAdmin(user);
    if (!isAdmin) throw new ForbiddenException('This Resource Is Forbidden');

    return await this.checkUser(user);
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
