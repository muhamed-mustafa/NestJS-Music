import 'dotenv/config';
import { AWSError, S3 } from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import fileUpload from 'express-fileupload';
import { PromiseResult } from 'aws-sdk/lib/request';

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, REGION } = process.env;

const s3 = new S3({
  region: REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class AwsService {
  async fileUpload(
    file: fileUpload.UploadedFile,
    folderName: string,
  ): Promise<S3.ManagedUpload.SendData> {
    const randomName = randomBytes(8).toString('hex');

    const params: S3.Types.PutObjectRequest = {
      Bucket: `${process.env.BUCKET_NAME}`,
      Key: `${folderName}/${randomName}.${file.mimetype.split('/')[1]}`,
      Body: file.data,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    return await s3.upload(params).promise();
  }

  async deleteFile(
    fileName: string,
  ): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
    const params: S3.DeleteObjectRequest = {
      Bucket: `${process.env.BUCKET_NAME}`,
      Key: fileName.split('com/')[1],
    };

    return await s3.deleteObject(params).promise();
  }
}
