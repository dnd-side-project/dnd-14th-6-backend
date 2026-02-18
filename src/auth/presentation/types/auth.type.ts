export type OAuthStatePayload = {
  redirectUrl?: string;
  gameSessionId?: string;
};

export type AuthQuery = OAuthStatePayload;

export type AuthRequest = { query: AuthQuery };

export type OAuthStateQuery = {
  state?: string;
};

export type OAuthCallbackRequest = Request & {
  query: OAuthStateQuery;
  user: {
    id: string;
    email: string;
    nickname: string;
    profileImage?: string;
    githubUrl?: string | null;
  };
};
