import { SAMPLE_BOOK_LABEL, SAMPLE_BAR_TEXT } from './copy';
import {
  SAMPLE_BAR_CSS,
  SAMPLE_BAR_SCRIPT,
  sampleBookHref,
} from './sample-bar';

/** Same bar the /s route injects, for the older /d template render. */
export function SampleBar({
  businessId,
}: {
  businessId?: string | null;
}) {
  const href = sampleBookHref(businessId);
  return (
    <>
      <div
        id="vai-sample-sentinel"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '100vh',
          left: 0,
          width: 1,
          height: 1,
          pointerEvents: 'none',
        }}
      />
      <div id="vai-sample-bar" hidden>
        <p>{SAMPLE_BAR_TEXT}</p>
        {href ? <a href={href}>{SAMPLE_BOOK_LABEL}</a> : null}
      </div>
      <style>{SAMPLE_BAR_CSS}</style>
      <script dangerouslySetInnerHTML={{ __html: SAMPLE_BAR_SCRIPT }} />
    </>
  );
}
