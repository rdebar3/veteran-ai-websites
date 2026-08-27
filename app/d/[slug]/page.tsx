import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { isPreviewFlag, resolveDemoView } from '@/lib/demo/decision';
import { ExpiredDemo } from '@/lib/demo/expired';
import { parseDemoFacts } from '@/lib/demo/facts';
import { getDemoSiteBySlug } from '@/lib/demo/supabase';
import { DemoSiteView } from '@/lib/demo/render';

const loadDemoSite = cache(getDemoSiteBySlug);

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string | string[] }>;
};

const NOINDEX: Metadata['robots'] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  const site = await loadDemoSite(slug);
  const kind = resolveDemoView(site, {
    preview: isPreviewFlag(query.preview),
    now: new Date(),
  });

  if (kind === 'not_found' || !site) {
    return { title: 'Not found', robots: NOINDEX };
  }

  if (kind === 'expired') {
    return { title: 'This sample has expired', robots: NOINDEX };
  }

  const name = parseDemoFacts(site.facts).name.value;
  return {
    title: name || 'Sample homepage',
    robots: NOINDEX,
  };
}

export default async function DemoPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const site = await loadDemoSite(slug);
  const kind = resolveDemoView(site, {
    preview: isPreviewFlag(query.preview),
    now: new Date(),
  });

  if (kind === 'not_found' || !site) {
    notFound();
  }

  if (kind === 'expired') {
    return <ExpiredDemo />;
  }

  return <DemoSiteView site={site} />;
}
