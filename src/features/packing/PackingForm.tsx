import { useState, type FormEvent } from 'react';

export const PACKING_NAME_MAX_LENGTH = 120;

interface PackingFormProps {
  onSubmit: (name: string) => void;
}

export default function PackingForm({ onSubmit }: PackingFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setError('Bitte einen Namen eingeben.');
      return;
    }
    if (trimmed.length > PACKING_NAME_MAX_LENGTH) {
      setError(
        `Der Name darf höchstens ${PACKING_NAME_MAX_LENGTH} Zeichen lang sein.`,
      );
      return;
    }
    onSubmit(trimmed);
    setName('');
    setError(null);
  }

  return (
    <form className="pack-form" onSubmit={handleSubmit} noValidate>
      <label className="sr-only" htmlFor="pack-new">
        Neuer Eintrag
      </label>
      <input
        className={`input${error ? ' input--error' : ''}`}
        id="pack-new"
        type="text"
        value={name}
        maxLength={PACKING_NAME_MAX_LENGTH}
        placeholder="Neuer Eintrag, z. B. Reiseadapter"
        autoComplete="off"
        aria-invalid={error ? true : undefined}
        onChange={(event) => {
          setName(event.target.value);
          if (error) setError(null);
        }}
      />
      <button className="btn btn--primary" type="submit">
        Hinzufügen
      </button>
      {error && (
        <p className="field-error pack-form__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
