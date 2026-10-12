'use client';

import { useState, type FormEvent } from 'react';
import { thanks } from '@/lib/ridge-bistro-data';

type Field = 'date' | 'time' | 'party' | 'name' | 'phone' | 'note';

const labels: Record<Field, string> = {
  date: 'Date',
  time: 'Time',
  party: 'Party size',
  name: 'Name',
  phone: 'Phone',
  note: 'Note',
};

export default function InquiryForm({
  fields,
  submitLabel,
}: {
  fields: Field[];
  submitLabel: string;
}) {
  const [done, setDone] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDone(true);
  }

  if (done) {
    return (
      <p className="rb-thanks" role="status">
        {thanks}
      </p>
    );
  }

  const isTimed = (field: Field): field is 'date' | 'time' | 'party' =>
    field === 'date' || field === 'time' || field === 'party';
  const timed = fields.filter(isTimed);
  const rest = fields.filter((field) => !isTimed(field));

  return (
    <form className="rb-form" onSubmit={onSubmit}>
      {timed.length > 0 ? (
        <div className="rb-row">
          {timed.map((field) => (
            <Field key={field} field={field} />
          ))}
        </div>
      ) : null}
      {rest.map((field) => (
        <Field key={field} field={field} />
      ))}
      <button className="rb-btn rb-btn--solid rb-btn--wide" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

function Field({ field }: { field: Field }) {
  if (field === 'note') {
    return (
      <label>
        {labels[field]}
        <textarea name={field} rows={4} />
      </label>
    );
  }
  const type = field === 'date' ? 'date' : field === 'time' ? 'time' : field === 'phone' ? 'tel' : 'text';
  return (
    <label>
      {labels[field]}
      <input
        name={field}
        type={type}
        required
        autoComplete={field === 'name' ? 'name' : field === 'phone' ? 'tel' : undefined}
      />
    </label>
  );
}
