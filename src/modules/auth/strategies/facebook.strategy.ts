import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { config } from '../../../../config';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {
    super({
      clientID: config.oAuthFacebook.FACEBOOK_CLIENT_ID,
      clientSecret: config.oAuthFacebook.FACEBOOK_SECRET_ID,
      callbackURL: config.oAuthFacebook.CALL_BACK_URI,
      scope: config.oAuthFacebook.SCOPE,
      profileFields: ['id', 'displayName', 'email', 'photos', 'name'],
    });
  }

  async validate(
    _request: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: any,
  ) {
    const { id } = profile;

    let user = await this.userRepository.findOne({
      where: {
        facebookId: id,
      },
    });

    if (!user) {
      const { user, token } = await this.authService.signInWithFacebook({
        profile,
        facebookId: id,
      });

      return done(null, { user, token });
    }

    const { emails } = profile;
    const jwt = await this.authService.generateJwtToken(emails[0].value);
    return done(null, { user, jwt });
  }
}
