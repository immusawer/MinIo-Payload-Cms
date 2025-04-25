import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Function to generate a presigned URL for a private image
export const generatePresignedUrl = async (filename: string, expirationSeconds: number = 3600) => {
  try {
    const s3Client = new S3Client({
      region: process.env.MINIO_REGION || 'us-east-1',
      endpoint: process.env.MINIO_ENDPOINT,
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || '',
        secretAccessKey: process.env.MINIO_SECRET_KEY || '',
      },
      forcePathStyle: true,
    });

    const bucketName = process.env.MINIO_BUCKET || '';
    const key = `private-images/${filename}`;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    // Generate the presigned URL
    const url = await getSignedUrl(s3Client, command, { expiresIn: expirationSeconds });
    
    // Calculate expiration time
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expirationSeconds);

    return {
      url,
      expiresAt,
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return null;
  }
};