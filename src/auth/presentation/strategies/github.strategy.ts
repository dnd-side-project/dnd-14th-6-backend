import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: '/api/auth/login/github/callback',
      scope: ['user:email'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, username, emails, photos } = profile;

    if (!emails?.[0]?.value) {
      throw new UnauthorizedException('Github 계정 이메일 정보가 없어 로그인할 수 없습니다.');
    }

    return {
      id,
      email: emails[0].value,
      nickname: username,
      githubUrl: profile.profileUrl ?? null,
      profileImage: photos?.[0]?.value,
    };
  }
}
