import { after, NextResponse, type NextRequest } from 'next/server';
import { isPreviewFlag, resolveDemoView } from '@/lib/demo/decision';
import {
  demoModelCsp,
  modelPageHeaders,
  modelPageOutcome,
} from '@/lib/demo/model-page';
import {
  getDemoModelHtml,
  getDemoSiteBySlug,
  supabaseOrigin,
} from '@/lib/demo/supabase';
import { recordDemoView, shouldRecordDemoView } from '@/lib/demo/views';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const isPreview = isPreviewFlag(
    request.nextUrl.searchParams.get('preview') ?? undefined,
  );
  const site = await getDemoSiteBySlug(slug);
  const kind = resolveDemoView(site, {
    preview: isPreview,
    now: new Date(),
  });
  const html =
    kind === 'render' && site?.model_status === 'ready'
      ? await getDemoModelHtml(site.slug)
      : null;
  const outcome = modelPageOutcome({
    kind,
    modelStatus: site?.model_status ?? null,
    html,
    slug: site?.slug ?? slug,
    preview: isPreview,
  });

  if (outcome.status === 404) {
    return new NextResponse(outcome.body, {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  if (outcome.status === 307) {
    return NextResponse.redirect(new URL(outcome.location, request.url), 307);
  }

  if (site && shouldRecordDemoView(kind)) {
    const userAgent = request.headers.get('user-agent');
    after(() => {
      void recordDemoView({
        slug: site.slug,
        isPreview,
        userAgent,
      });
    });
  }

  return new NextResponse(html ?? '', {
    status: 200,
    headers: modelPageHeaders(demoModelCsp(supabaseOrigin())),
  });
}
