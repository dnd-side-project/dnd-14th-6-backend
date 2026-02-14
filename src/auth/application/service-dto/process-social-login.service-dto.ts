import { SocialLoginProvider } from '../../domain/auth.business-rule';

export interface processSocialLoginRequestDto {
  provider: SocialLoginProvider;
  socialUser: {
    id: string;
    email: string;
    nickname: string;
    profileImage?: string;
    githubUrl?: string | null;
  };
  gameSessionId?: bigint;
}

export interface ProcessSocialLoginResponseDto {
  accessToken: string;
  refreshToken: string;
}
