type ScrollTask = {
  run: () => void;
  isActive: () => boolean;
};

const tasks = new Set<ScrollTask>();
let rafId = 0;
let enabled = true;

function frame() {
  rafId = 0;
  if (!enabled) return;

  let anyActive = false;
  for (const task of tasks) {
    if (task.isActive()) {
      task.run();
      anyActive = true;
    }
  }

  if (anyActive && tasks.size > 0) {
    rafId = requestAnimationFrame(frame);
  }
}

export function setScrollDriverEnabled(value: boolean) {
  enabled = value;
  if (!value && rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
}

/** Schedule scroll-driven updates. Runs one rAF loop shared by all subscribers. */
export function notifyScroll() {
  if (!enabled || rafId || tasks.size === 0) return;
  rafId = requestAnimationFrame(frame);
}

export function registerScrollTask(task: ScrollTask): () => void {
  tasks.add(task);
  return () => {
    tasks.delete(task);
    if (tasks.size === 0 && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };
}

/** True when element intersects the viewport (with margin). */
export function isInViewport(el: HTMLElement, margin = 120): boolean {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  return rect.bottom > -margin && rect.top < vh + margin;
}