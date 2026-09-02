import type { ArtRow } from './art';
import {
  DEMO_TEMPLATE_TRADES_V1,
  DEMO_TEMPLATE_TRADES_V2,
  DEMO_TEMPLATE_V0,
} from './copy';
import { TradesV1Template } from './trades-v1-template';
import { TradesV2Template } from './trades-v2-template';
import type { DemoSiteRow } from './types';
import { V0Template } from './v0-template';

/** Known keys render themselves; everything else falls back to v0. */
export function resolveDemoTemplateKey(
  key: string | null | undefined,
):
  | typeof DEMO_TEMPLATE_TRADES_V2
  | typeof DEMO_TEMPLATE_TRADES_V1
  | typeof DEMO_TEMPLATE_V0 {
  if (key === DEMO_TEMPLATE_TRADES_V2) return DEMO_TEMPLATE_TRADES_V2;
  if (key === DEMO_TEMPLATE_TRADES_V1) return DEMO_TEMPLATE_TRADES_V1;
  return DEMO_TEMPLATE_V0;
}

export function DemoSiteView({
  site,
  artPool = [],
}: {
  site: DemoSiteRow;
  artPool?: ArtRow[];
}) {
  const key = resolveDemoTemplateKey(site.template_key);
  if (key === DEMO_TEMPLATE_TRADES_V2) {
    return <TradesV2Template site={site} pool={artPool} />;
  }
  if (key === DEMO_TEMPLATE_TRADES_V1) {
    return <TradesV1Template site={site} />;
  }
  return <V0Template site={site} />;
}
