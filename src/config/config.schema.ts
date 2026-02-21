import * as Joi from 'joi';

export const configSchema = Joi.object({
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GITHUB_CLIENT_ID: Joi.string().required(),
  GITHUB_CLIENT_SECRET: Joi.string().required(),
  JWT_TOKEN_SECRET: Joi.string().required(),
  JWT_AUTH_CODE_SECRET: Joi.string().required(),
  SERVER_URL: Joi.string().required(),
});
