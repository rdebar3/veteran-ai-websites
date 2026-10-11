import type { PlanName } from '@/lib/data';

export type PlanChoice = PlanName | null;

const listeners = new Set<(plan: PlanChoice) => void>();
let chosen: PlanChoice = null;

export function getChosenPlan(): PlanChoice {
  return chosen;
}

export function setChosenPlan(plan: PlanChoice): void {
  chosen = plan;
  for (const fn of [...listeners]) fn(plan);
}

export function subscribeChosenPlan(fn: (plan: PlanChoice) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
