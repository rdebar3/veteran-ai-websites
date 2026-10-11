import { afterEach, describe, expect, it } from 'vitest';
import { getChosenPlan, setChosenPlan, subscribeChosenPlan, type PlanChoice } from './plan-choice';

afterEach(() => {
  setChosenPlan(null);
});

describe('chosen plan', () => {
  it('round-trips set and get', () => {
    expect(getChosenPlan()).toBeNull();
    setChosenPlan('Starter');
    expect(getChosenPlan()).toBe('Starter');
    setChosenPlan('Premium');
    expect(getChosenPlan()).toBe('Premium');
    setChosenPlan(null);
    expect(getChosenPlan()).toBeNull();
  });

  it('notifies a subscriber with the new value and stops after unsubscribe', () => {
    const seen: PlanChoice[] = [];
    const unsubscribe = subscribeChosenPlan((plan) => {
      seen.push(plan);
    });
    try {
      setChosenPlan('Complete');
      expect(seen).toEqual(['Complete']);
      expect(getChosenPlan()).toBe('Complete');
      unsubscribe();
      setChosenPlan('Starter');
      expect(seen).toEqual(['Complete']);
      expect(getChosenPlan()).toBe('Starter');
    } finally {
      unsubscribe();
    }
  });
});
