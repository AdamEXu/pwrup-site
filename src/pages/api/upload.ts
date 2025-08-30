import type { APIRoute } from 'astro';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.R2_ACCOUNT_ID!;
const accessKeyId = process.env.R2_ACCESS_KEY_ID!;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!;
const bucketName = process.env.R2_BUCKET_NAME!;
const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL!;

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const filename = url.searchParams.get('filename');
  if (!filename) {
    return new Response(JSON.stringify({ error: 'filename required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const key = `${Date.now()}-${filename}`;
  const command = new PutObjectCommand({ Bucket: bucketName, Key: key });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
  const publicUrl = `${publicBaseUrl}/${key}`;

  return new Response(JSON.stringify({ uploadUrl, publicUrl }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
