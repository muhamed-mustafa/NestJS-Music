import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthConstants } from 'src/common/constants/auth-constants';
import { JwtPayload } from 'src/common/interfaces/jwt-payload';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: AuthConstants.secretKey,
    });
  }

  async validate({ email }: JwtPayload): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedException('User Is Not Authorized');
    return user;
  }
}
