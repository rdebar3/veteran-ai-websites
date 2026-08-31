import { after } from 'next/server';
import type { NextRequest } from 'next/server';
import { isPreviewFlag } from '@/lib/demo/decision';
import { handleDemoShotRequest } from '@/lib/demo/shot-public';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const preview = isPreviewFlag(
    request.nextUrl.searchParams.get('preview') ?? undefined,
  );

  return handleDemoShotRequest({
    slug,
    preview,
    userAgent: request.headers.get('user-agent'),
    defer: (work) => {
      after(() => {
        void work();
      });
    },
  });
}
