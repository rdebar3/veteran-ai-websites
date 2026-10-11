const PLANS = ['Starter', 'Complete', 'Premium'] as const;

export type InquiryPlan = (typeof PLANS)[number];

export type InquiryInput = {
  name: string;
  business?: string;
  email?: string;
  phone: string;
  projectType?: string;
  plan?: string | null;
  wantsStore?: boolean;
  isVeteran?: boolean;
  message?: string;
};

export type InquiryRow = {
  name: string;
  business: string | null;
  email: string | null;
  phone: string;
  project_type: string | null;
  plan: InquiryPlan | null;
  wants_store: boolean;
  is_veteran: boolean;
  message: string | null;
  source: 'website';
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimmed(value: string | null | undefined): string {
  return (value ?? '').trim();
}

function optionalText(value: string | null | undefined, max: number): string | null {
  const text = trimmed(value);
  if (!text) return null;
  return text.slice(0, max);
}

export function validateInquiry(
  input: InquiryInput
): { ok: true; row: InquiryRow } | { ok: false; field: 'name' | 'phone' | 'email'; message: string } {
  const name = trimmed(input.name);
  if (!name) {
    return { ok: false, field: 'name', message: 'Enter your name.' };
  }
  if (name.length > 100) {
    return { ok: false, field: 'name', message: 'Name must be 100 characters or fewer.' };
  }

  const phone = trimmed(input.phone);
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) {
    return {
      ok: false,
      field: 'phone',
      message: 'Enter a phone number with at least 10 digits.',
    };
  }
  if (phone.length > 40) {
    return { ok: false, field: 'phone', message: 'Phone must be 40 characters or fewer.' };
  }

  const emailText = trimmed(input.email);
  if (emailText && (emailText.length > 160 || !EMAIL.test(emailText))) {
    return { ok: false, field: 'email', message: 'Enter a valid email address.' };
  }

  const planText = trimmed(input.plan);
  const plan = (PLANS as readonly string[]).includes(planText) ? (planText as InquiryPlan) : null;
  const project = trimmed(input.projectType);

  return {
    ok: true,
    row: {
      name,
      business: optionalText(input.business, 140),
      email: emailText ? emailText : null,
      phone,
      project_type: project ? project : null,
      plan,
      wants_store: input.wantsStore === true,
      is_veteran: input.isVeteran === true,
      message: optionalText(input.message, 3000),
      source: 'website',
    },
  };
}
