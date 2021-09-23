import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { makeFrontError } from '../utils/exception';
import path from 'path';
import { env } from '../env';

type FileType = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  storageClass: string;
  location: string;
  etag: string;
};

export const fileUploadService = () => {
  const getAwsS3 = () => {
    if (!env.AWS_S3_ENDPOINT_URL || !env.AWS_SECRET_ACCESS_KEY || !env.AWS_ACCESS_KEY_ID || !env.AWS_S3_REGION_NAME) {
      throw makeFrontError('Environment not set to create s3 instance', 'uploadEnvironmentNotSet');
    }

    // Ref: https://www.digitalocean.com/community/tutorials/how-to-upload-a-file-to-object-storage-with-node-js
    // Creates a new instance of the s3 storage
    return new aws.S3({
      endpoint: env.AWS_S3_ENDPOINT_URL,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      region: env.AWS_S3_REGION_NAME
    });
  };

  /**
   * Parses the provided fileKey and append a suffix between its name and extension
   * @param fileKey The file key you want to append the suffix
   * @param suffix  The suffix string to be appended
   */
  const makeNewFileKey = (fileKey: string, suffix: string) => {
    // Gets the extension
    const ext = path.extname(fileKey);

    // Get the last index(since it's an extension it's the last) in the string, that contains the extension
    const extPosition = fileKey.lastIndexOf(ext);

    // Creates a new string with ${fileKey STRIPPED OUT of its extension}${suffix}${puts the extension back}
    return `${fileKey.substring(0, extPosition)}${suffix}${ext}`;
  };

  /**
   * Checks if the file with the provided path exists. And if it does, returns a new path
   * @param initialFilePath the initial file path to check if exists
   * @param s3 the s3 storage instance
   * @param bucketName the name of the bucket to be tested
   * @param throwIfFileExists If the file exists, instead of generating a new file name, will throw an error
   */
  const getNewFilePathIfExists = async (
    initialFilePath: string,
    s3: aws.S3,
    bucketName: string,
    throwIfFileExists?: boolean
  ) => {
    let fileExists = true;
    let fileKey = initialFilePath;
    let index = 0;

    while (fileExists) {
      try {
        // Gets the object metadata
        await s3.headObject({ Bucket: bucketName, Key: fileKey }).promise();
        // If got here, the file exists, should try again with a different fileKey
      } catch {
        // If the method throws, it means it was not found
        fileExists = false;
      }

      index++;
      if (throwIfFileExists && fileExists) {
        throw makeFrontError('File already exists', 'fileExists');
      }
      // Make the file key separately so its thrown errors does not set fileExists as false
      else if (fileExists) {
        fileKey = makeNewFileKey(initialFilePath, `(${index})`);
      }
    }

    return fileKey;
  };

  /**
   * Uploads a file to the s3 storage
   * @param req The express request object
   * @param res The express result object
   * @param filePathNoExtension The final file path without extension(the extension will be used based on the uploaded file)
   * @param allowedMaximumFileSizeInBytes The maximum file size that is allowed. In bytes. If none is provided all sizes are allowed.
   * @param allowedExtensions The allowed file extensions. Split by the character "|". If none is provided, all extensions are allowed.
   * @param throwIfFileExists If the file exists, instead of generating a new file name, will throw an error
   */
  const uploadFileToStorage = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res: any,
    filePathNoExtension: string,
    allowedMaximumFileSizeInBytes?: number,
    allowedExtensions?: string,
    throwIfFileExists?: boolean
  ) =>
    new Promise<FileType[]>((resolve, reject) => {
      if (!env.AWS_STORAGE_BUCKET_NAME || !env.AWS_DEFAULT_ACL) {
        throw makeFrontError('Environment not set to upload files', 'uploadEnvironmentNotSet');
      }

      const s3 = getAwsS3();
      const bucket = env.AWS_STORAGE_BUCKET_NAME;

      // Multer to upload the file
      multer({
        limits: {
          // limits the file size
          fileSize: allowedMaximumFileSizeInBytes
        },
        fileFilter: (_req, file, cb) => {
          // Get the extension and remove the `.`
          const ext = path.extname(file.originalname).substr(1).toLowerCase();
          if (!allowedExtensions) {
            // To accept the file pass `true`
            cb(null, true);
          } else {
            // Get the allowed extensions and creates an array from the string
            const fileTypes = allowedExtensions.split('|');
            cb(
              null,
              // True if there's some extension equals to the current file extension
              fileTypes.some((type) => type === ext)
            );
          }
        },
        // Use the multer s3 as the storage
        storage: multerS3({
          // Attach the s3 storage instance
          s3,
          bucket,
          acl: env.AWS_DEFAULT_ACL,
          // Appends the file path + extension to the final file
          key: (_request, file, cb) => {
            // Appends the file extension to the path without extension
            const initialPath = `${filePathNoExtension}${path.extname(file.originalname)}`;

            // Calls the filename check
            getNewFilePathIfExists(initialPath, s3, bucket, throwIfFileExists)
              .then((finalPath) => cb(null, finalPath)) // then, calls the cb(callback), with the final path
              .catch(cb); // If an error is thrown
          }
        })
        // There should only be 1 file at the 'file' key
        // Also calls the middleware, providing req and res
      }).array('file', 1)(req, res, (error) => {
        if (error) {
          // If there's an error
          reject(error);
        } else {
          // If succeeded
          resolve(req.files as FileType[]);
        }
      });
    });

  /**
   * Deletes files from storage. CAUTION THIS OPERATION IS IRREVERSIBLE
   * @param filePaths the list of files to delete
   */
  const DELETEFilesOnStorageCAUTION = async (filePaths: string[]) => {
    if (!env.AWS_STORAGE_BUCKET_NAME || !env.AWS_DEFAULT_ACL) {
      throw makeFrontError('Environment not set to upload files', 'uploadEnvironmentNotSet');
    }

    console.log('------------------- DELETING FILES ------------------------', filePaths);

    return getAwsS3()
      .deleteObjects({
        Bucket: env.AWS_STORAGE_BUCKET_NAME,
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
    DELETEFilesOnStorageCAUTION
  };
};
