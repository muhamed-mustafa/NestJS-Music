import 'dotenv/config';

export const AuthConstants = {
  secretKey: process.env.SECRET_KEY,
  strategies: ['jwt'],
  expiresIn: process.env.EXPIRES_IN,
};
