export const BOOK_URL =
  process.env.NEXT_PUBLIC_BOOK_URL || 'https://app.veteranaiwebsites.com/book';

type ScheduleCallProps = {
  /** Small line under the button. Use where the layout has room. */
  note?: boolean;
  variant?: 'button' | 'compact' | 'block' | 'inline';
  className?: string;
  buttonClassName?: string;
  onClick?: () => void;
};

const styles = `
.sched{display:inline-flex;flex-direction:column;align-items:center;gap:6px;max-width:100%}
.sched__btn{display:inline-flex;align-items:center;justify-content:center;font-family:var(--font-sans);font-size:15px;font-weight:700;line-height:1;color:#0a0e14;background:#fff;border:1px solid rgba(255,255,255,.9);border-radius:999px;padding:12px 18px;text-decoration:none;white-space:nowrap;box-shadow:0 10px 28px rgba(0,0,0,.35);transition:transform .2s,box-shadow .2s}
.sched__btn:hover{transform:translateY(-1px);box-shadow:0 14px 34px rgba(0,0,0,.45)}
.sched__note{font-family:var(--font-sans);font-size:12.5px;line-height:1.35;color:rgba(233,240,246,.72);text-align:center}
.sched--compact .sched__btn{font-size:14px;padding:8px 14px;box-shadow:0 8px 18px rgba(0,0,0,.28)}
.sched--block{display:flex;align-items:stretch;width:100%}
.sched--block .sched__btn{width:100%}
.sched__inline{color:#fff;font-weight:700;text-decoration:underline;text-underline-offset:3px}
.sched__inline:hover{color:#fff}
`;

/** "Schedule a call" button. Falls back when NEXT_PUBLIC_BOOK_URL is unset. */
export default function ScheduleCall({
  note = false,
  variant = 'button',
  className,
  buttonClassName,
  onClick,
}: ScheduleCallProps) {
  if (variant === 'inline') {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <a className={className ? `sched__inline ${className}` : 'sched__inline'} href={BOOK_URL} onClick={onClick}>
          Schedule a call
        </a>
      </>
    );
  }

  const variantClass =
    variant === 'compact' ? ' sched--compact' : variant === 'block' ? ' sched--block' : '';

  return (
    <span className={`sched${variantClass}${className ? ` ${className}` : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <a className={buttonClassName || 'sched__btn'} href={BOOK_URL} onClick={onClick}>
        Schedule a call
      </a>
      {note ? <span className="sched__note">20 minutes. I call you.</span> : null}
    </span>
  );
}
