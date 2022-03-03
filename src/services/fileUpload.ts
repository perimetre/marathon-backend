import aws from 'aws-sdk';
import { env } from '../env';
import { makeError } from '../utils/exception';
import axios, { AxiosResponse } from 'axios';

export const fileUploadService = () => {
  const {
    AWS_S3_ENDPOINT_URL,
    AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY_ID,
    AWS_S3_REGION_NAME,
    AWS_STORAGE_BUCKET_NAME,
    AWS_DEFAULT_ACL
  } = env;

  const getAwsS3 = () => {
    if (!AWS_S3_ENDPOINT_URL || !AWS_SECRET_ACCESS_KEY || !AWS_ACCESS_KEY_ID || !AWS_S3_REGION_NAME) {
      throw makeError('Environment not set to create s3 instance', 'invalidEnvironment');
    }

    // Ref: https://www.digitalocean.com/community/tutorials/how-to-upload-a-file-to-object-storage-with-node-js
    // Creates a new instance of the s3 storage
    return new aws.S3({
      endpoint: AWS_S3_ENDPOINT_URL,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      accessKeyId: AWS_ACCESS_KEY_ID,
      region: AWS_S3_REGION_NAME
    });
  };

  const uploadFileToStorage = (file: Buffer, destination: string) =>
    new Promise<void>(async (resolve, reject) => {
      if (!AWS_STORAGE_BUCKET_NAME || !AWS_DEFAULT_ACL) {
        reject(makeError('Environment not set to upload files', 'invalidEnvironment'));
      }

      try {
        // Setup aws services
        const s3 = getAwsS3();
        const bucket = AWS_STORAGE_BUCKET_NAME as string;

        // Uploads file
        s3.putObject(
          {
            Bucket: bucket,
            Key: destination,
            Body: file,
            ACL: AWS_DEFAULT_ACL
          },
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      } catch (err) {
        reject(err);
      }
    });

  const downloadFile = async (url: string): Promise<AxiosResponse<Buffer>> =>
    axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer'
    });

  const DELETEFilesOnStorageCAUTION = async (filePaths: string[]) => {
    if (!AWS_STORAGE_BUCKET_NAME || !AWS_DEFAULT_ACL) {
      throw makeError('Environment not set to upload files', 'invalidEnvironment');
    }

    return getAwsS3()
      .deleteObjects({
        Bucket: AWS_STORAGE_BUCKET_NAME,
        Delete: {
          Objects: filePaths.map((path) => ({
            Key: decodeURIComponent(
              path[0] === '/' ? path.substr(1, path.length).replace(/^,/, '') : path.replace(/^,/, '')
            )
          }))
        }
      })
      .promise();
  };

  return {
    uploadFileToStorage,
    downloadFile,
    DELETEFilesOnStorageCAUTION
  };
};
