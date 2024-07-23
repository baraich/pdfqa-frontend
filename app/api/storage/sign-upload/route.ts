import {PutObjectAclCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import generateFileKey from "@/lib/generateFileKey";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as { file: string | undefined };

  const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const fileKey = generateFileKey(payload.file);
  const putObjectCommand = new PutObjectCommand({
    Key: fileKey,
    Bucket: process.env.AWS_BUCKET!,
  });

  return NextResponse.json({
    fileKey,
    signedUrl: await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 60 * 5,
    }),
  });
}
