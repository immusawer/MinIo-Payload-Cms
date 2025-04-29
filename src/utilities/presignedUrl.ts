import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface PresignedUrlData {
  url: string;
  expiresAt: Date;
}

export const generatePresignedUrl = async (
  filename: string,
  expiresIn: number
): Promise<PresignedUrlData | null> => {
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

    const command = new GetObjectCommand({
      Bucket: process.env.MINIO_BUCKET,
      Key: `private-images/${filename}`,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    return { url, expiresAt };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return null;
  }
};