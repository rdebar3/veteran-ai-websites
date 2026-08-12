import { BRANCH, FULL_NAME, PHONE, PHONE_HREF, SERVICE_YEARS, TOWN } from '@/lib/contact';

const styles = `
.oi{position:relative;color:#eef4f8;padding:clamp(32px,4.5vw,52px) clamp(20px,6vw,72px);background:#06090f;border-top:1px solid rgba(233,240,246,.08)}
.oi__inner{max-width:720px;margin:0 auto;display:flex;align-items:center;gap:clamp(20px,3vw,32px)}
.oi__photo-wrap{flex:0 0 auto;position:relative}
/* Drop your headshot at: public/owner-photo.jpg — then set src="/owner-photo.jpg" on the img below */
.oi__photo{width:200px;height:200px;border-radius:50%;object-fit:cover;border:2px solid rgba(233,240,246,.22);background:rgba(255,255,255,.04);display:block}
.oi__text{flex:1;min-width:0}
.oi__name{font-family:var(--font-sans);font-size:clamp(20px,2.2vw,26px);font-weight:700;letter-spacing:-.02em;color:#fff;margin:0 0 8px}
.oi__meta{font-size:clamp(13px,1.1vw,15px);line-height:1.5;color:rgba(233,240,246,.78);margin:0 0 12px}
.oi__phone{font-size:clamp(14px,1.15vw,16px);line-height:1.5;margin:0}
.oi__phone a{color:#f4f7fa;font-weight:600;text-decoration:none;border-bottom:1px solid rgba(244,247,250,.35);transition:border-color .2s,color .2s}
.oi__phone a:hover{color:#fff;border-bottom-color:#fff}
.oi__phone-note{color:rgba(233,240,246,.72);font-weight:400}
@media(max-width:640px){
  .oi__inner{flex-direction:column;text-align:center}
  .oi__photo{width:160px;height:160px;margin:0 auto}
}
`;

/**
 * Trust block: owner name, service line, phone.
 */
export default function OwnerIntro() {
  return (
    <section className="oi" aria-label="About the owner">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="oi__inner">
        <div className="oi__photo-wrap">
          {/*
            OWNER HEADSHOT — drop file at public/owner-photo.jpg
            then change src below to "/owner-photo.jpg"
          */}
          <img
            className="oi__photo"
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23121820' width='200' height='200'/%3E%3Ccircle cx='100' cy='78' r='32' fill='%232a3340'/%3E%3Cellipse cx='100' cy='168' rx='56' ry='42' fill='%232a3340'/%3E%3Ctext x='100' y='118' text-anchor='middle' fill='%236b7585' font-size='11' font-family='system-ui,sans-serif'%3EPhoto%3C/text%3E%3C/svg%3E"
            width={200}
            height={200}
            alt={`${FULL_NAME}, owner of Veteran AI Websites`}
          />
        </div>
        <div className="oi__text">
          <p className="oi__name">{FULL_NAME}</p>
          <p className="oi__meta">
            {BRANCH} · {SERVICE_YEARS} · {TOWN}, West Virginia
          </p>
          <p className="oi__phone">
            <a href={PHONE_HREF}>{PHONE}</a>
            <span className="oi__phone-note"> — call or text, it reaches me directly</span>
          </p>
        </div>
      </div>
    </section>
  );
}
