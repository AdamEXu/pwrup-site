import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { r as requireAdmin, A as AuthError } from '../../chunks/auth_DZR22y3g.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${"496fbe0bf0003addc2e0116caff5d215"}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: "244e40e77aed8481220b42af8a40351a",
    secretAccessKey: "2981ab5e6634f0a446a256af070971bb71cb2eb70856f95952be38202b29df60"
  }
});
const POST = async (context) => {
  try {
    await requireAdmin(context);
    const formData = await context.request.formData();
    const file = formData.get("file");
    if (!file) {
      return new Response("No file provided", { status: 400 });
    }
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp"
    ];
    if (!allowedTypes.includes(file.type)) {
      return new Response("Invalid file type. Only images are allowed.", {
        status: 400
      });
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response("File too large. Maximum size is 10MB.", {
        status: 400
      });
    }
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    const filename = `uploads/${timestamp}-${randomString}.${extension}`;
    const buffer = await file.arrayBuffer();
    const command = new PutObjectCommand({
      Bucket: "pinewood-one",
      Key: filename,
      Body: new Uint8Array(buffer),
      ContentType: file.type,
      ContentLength: file.size
    });
    await s3Client.send(command);
    const publicUrl = `${"https://496fbe0bf0003addc2e0116caff5d215.r2.cloudflarestorage.com"}/${filename}`;
    return new Response(
      JSON.stringify({
        url: publicUrl,
        filename,
        size: file.size,
        type: file.type
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (e) {
    console.error("Upload error:", e);
    if (e instanceof AuthError) {
      return new Response(e.message, { status: e.status });
    }
    return new Response("Upload failed", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
