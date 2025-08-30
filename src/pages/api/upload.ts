import type { APIRoute } from "astro";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { requireAdmin, AuthError } from "../../lib/auth";
export const prerender = false;

// Configure S3 client for Cloudflare R2
const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${
        import.meta.env.R2_ACCOUNT_ID
    }.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: import.meta.env.R2_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.R2_SECRET_ACCESS_KEY,
    },
});

export const POST: APIRoute = async (context) => {
    try {
        await requireAdmin(context);

        const formData = await context.request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new Response("No file provided", { status: 400 });
        }

        // Validate file type
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
            return new Response("Invalid file type. Only images are allowed.", {
                status: 400,
            });
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return new Response("File too large. Maximum size is 10MB.", {
                status: 400,
            });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = file.name.split(".").pop();
        const filename = `uploads/${timestamp}-${randomString}.${extension}`;

        // Convert file to buffer
        const buffer = await file.arrayBuffer();

        // Upload to R2
        const command = new PutObjectCommand({
            Bucket: import.meta.env.R2_BUCKET_NAME,
            Key: filename,
            Body: new Uint8Array(buffer),
            ContentType: file.type,
            ContentLength: file.size,
        });

        await s3Client.send(command);

        // Return the public URL
        const publicUrl = `${import.meta.env.R2_PUBLIC_BASE_URL}/${filename}`;

        return new Response(
            JSON.stringify({
                url: publicUrl,
                filename,
                size: file.size,
                type: file.type,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
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
