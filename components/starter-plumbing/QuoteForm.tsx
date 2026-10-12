'use client';

import { useState, type FormEvent } from 'react';
import { services, thanks } from '@/lib/starter-plumbing-data';

export default function QuoteForm() {
  const [done, setDone] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDone(true);
  }

  if (done) {
    return (
      <p className="sp-thanks" role="status">
        {thanks}
      </p>
    );
  }

  return (
    <form className="sp-form" onSubmit={onSubmit}>
      <label>
        Name
        <input name="name" autoComplete="name" required />
      </label>
      <label>
        Phone
        <input name="phone" type="tel" autoComplete="tel" required />
      </label>
      <label>
        What do you need
        <select name="need" defaultValue="" required>
          <option value="" disabled>
            Choose one
          </option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        Details
        <textarea name="details" rows={4} />
      </label>
      <button className="sp-btn sp-btn--solid sp-btn--wide" type="submit">
        Get a quote
      </button>
    </form>
  );
}
