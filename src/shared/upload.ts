import { extname } from 'path';
import { randomBytes } from 'crypto';

export const fileFilter = (_req: any, file: any, cb: any) => {
  if (!file.originalname.match(/\.(jpg|png|jpeg|gif)$/)) {
    return cb(new Error('Only Image File Are Allowed'));
  }

  return cb(null, true);
};

export const fileUpload = async (_req: any, file: any, cb: any) => {
  const name = file.originalname.split('.')[0];

  const fileExtName = extname(file.originalname);

  const randomName = randomBytes(8).toString('hex');

  return cb(null, `${name}-${randomName}${fileExtName}`);
};
