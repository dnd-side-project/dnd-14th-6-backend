import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${configService.getOrThrow<string>('SERVER_URL')}/api/auth/login/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, name, emails, photos } = profile;

    if (!emails?.[0]?.value) {
      throw new UnauthorizedException('Google 계정 이메일 정보가 없어 로그인할 수 없습니다.');
    }

    if (!name?.familyName && !name?.givenName) {
      throw new UnauthorizedException('Google 계정 이름 정보가 없어 로그인할 수 없습니다.');
    }

    const fullName = `${name?.familyName ?? ''}${name?.givenName ?? ''}`.trim();

    return {
      id,
      email: emails[0].value,
      nickname: fullName,
      profileImage: photos?.[0]?.value,
    };
  }
}
