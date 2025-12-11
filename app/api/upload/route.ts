import { NextResponse } from 'next/server';
import { z } from 'zod';
import { uploadVideoToYouTube } from '@/lib/youtube';
import type { UploadPayload } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 300;

const seoSchema = z.object({
  title: z.string().min(10),
  description: z.string().min(20),
  hashtags: z.array(z.string()),
  tags: z.array(z.string()),
  thumbnailPrompt: z.string(),
  keywords: z.array(z.string())
});

const payloadSchema = z.object({
  videoSourceKind: z.enum(['file', 'url']),
  videoUrl: z.string().url().optional(),
  videoBaseName: z.string().min(3),
  category: z.enum(['tech', 'vlog', 'shorts', 'gaming', 'tutorial']),
  language: z.string().min(2),
  monetization: z.enum(['on', 'off']),
  scheduleTime: z.string().optional(),
  seo: seoSchema
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const payloadRaw = formData.get('payload');
    if (typeof payloadRaw !== 'string') {
      return NextResponse.json({ status: 'failed', message: 'Invalid payload.' }, { status: 400 });
    }

    const parsedPayload = payloadSchema.parse(JSON.parse(payloadRaw)) as UploadPayload;

    if (parsedPayload.videoSourceKind === 'url' && !parsedPayload.videoUrl) {
      return NextResponse.json(
        { status: 'failed', message: 'Video URL required when using remote link.' },
        { status: 400 }
      );
    }

    let fileBuffer: Buffer | undefined;
    if (parsedPayload.videoSourceKind === 'file') {
      const file = formData.get('videoFile');
      if (!file || !(file instanceof File)) {
        return NextResponse.json(
          { status: 'failed', message: 'Video file missing from payload.' },
          { status: 400 }
        );
      }
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    }

    const response = await uploadVideoToYouTube({
      payload: parsedPayload,
      videoBuffer: fileBuffer
    });

    const statusCode = response.status === 'failed' ? 500 : 200;
    return NextResponse.json(response, { status: statusCode });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error.';
    return NextResponse.json({ status: 'failed', message }, { status: 500 });
  }
}
