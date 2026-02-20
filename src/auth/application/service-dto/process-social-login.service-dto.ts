import { SocialLoginProvider } from '../../domain/auth.business-rule';

export interface ProcessSocialLoginFacadeRequestDto {
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

export interface ProcessSocialLoginFacadeResponseDto {
  userId: bigint;
}
