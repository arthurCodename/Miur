import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

type AuthFormFieldProps = {
  id: string;
  label: string;
  type?: "email" | "password" | "text";
  autoComplete?: string;
  error?: FieldError;
  registration: UseFormRegisterReturn<string>;
};

export function AuthFormField({
  id,
  label,
  type = "text",
  autoComplete,
  error,
  registration,
}: AuthFormFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-zinc-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        className="rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 outline-none ring-zinc-900/10 focus:border-zinc-400 focus:ring-2"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...registration}
      />
      {error ? (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}
