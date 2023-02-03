import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { config } from '../../../../config';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {
    super({
      clientID: config.oAuthGoogle.GOOGLE_CLIENT_ID,
      clientSecret: config.oAuthGoogle.GOOGLE_CLIENT_SECRET,
      callbackURL: config.oAuthGoogle.CALL_BACK_URI,
      passReqToCallback: true,
      scope: config.oAuthGoogle.SCOPE,
    });
  }

  async validate(
    _request: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id } = profile;

    let user = await this.userRepository.findOne({
      where: {
        googleId: id,
      },
    });

    if (!user) {
      const { user, token } = await this.authService.signInWithGoogle({
        profile,
        googleId: id,
      });
      return done(null, { user, token });
    }

    const { emails } = profile;
    const jwt = await this.authService.generateJwtToken(emails[0].value);
    return done(null, { user, jwt });
  }
}
