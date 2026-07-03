type ScrollTask = {
  run: () => void;
  isActive: () => boolean;
};

const tasks = new Set<ScrollTask>();
let enabled = true;

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