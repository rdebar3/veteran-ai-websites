type ScrollTask = {
  run: () => void;
  isActive: () => boolean;
};

type LenisScrollOptions = {
  offset?: number;
  immediate?: boolean;
  lock?: boolean;
};

type LenisLike = {
  scrollTo: (
    target: HTMLElement | string | number,
    options?: LenisScrollOptions
  ) => void;
  resize?: () => void;
};

const tasks = new Set<ScrollTask>();
let enabled = true;
let lenisInstance: LenisLike | null = null;

/** Run all active scroll tasks synchronously (call from Lenis rAF loop). */
export function runScrollFrame() {
  if (!enabled) return;

  for (const task of tasks) {
    if (task.isActive()) {
      task.run();
    }
  }
}

export function setScrollDriverEnabled(value: boolean) {
  enabled = value;
}

export function setLenisInstance(lenis: LenisLike | null) {
  lenisInstance = lenis;
}

/** Force the smooth-scroll engine to re-measure the page (after route changes). */
export function resizeScroll() {
  lenisInstance?.resize?.();
}

/** Unified scroll — routes through Lenis when active, native otherwise. */
export function scrollToElement(
  target: string | HTMLElement,
  options?: { offset?: number; immediate?: boolean; block?: ScrollLogicalPosition }
) {
  const el =
    typeof target === 'string'
      ? document.getElementById(target.replace(/^#/, ''))
      : target;

  if (!el) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(el, {
      offset: options?.offset ?? -72,
      immediate: options?.immediate,
    });
    return;
  }

  el.scrollIntoView({
    behavior: options?.immediate ? 'auto' : 'smooth',
    block: options?.block ?? 'start',
  });
}

/** Absolute document Y scroll via Lenis when available. */
export function scrollToY(
  y: number,
  options?: { immediate?: boolean; lock?: boolean }
) {
  if (lenisInstance) {
    lenisInstance.scrollTo(y, {
      immediate: options?.immediate,
      lock: options?.lock ?? true,
    });
    return;
  }
  window.scrollTo({
    top: y,
    behavior: options?.immediate ? 'auto' : 'smooth',
  });
}

/** @deprecated Prefer runScrollFrame inside the Lenis loop. Kept for resize hooks. */
export function notifyScroll() {
  runScrollFrame();
}

export function registerScrollTask(task: ScrollTask): () => void {
  tasks.add(task);
  return () => {
    tasks.delete(task);
  };
}

/** True when element intersects the viewport (with margin). */
export function isInViewport(el: HTMLElement, margin = 120): boolean {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  return rect.bottom > -margin && rect.top < vh + margin;
}