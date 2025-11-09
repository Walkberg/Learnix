import * as React from 'react';

export function Field({
  children,
  dataInvalid,
  orientation = 'vertical',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  dataInvalid?: boolean;
  orientation?: 'vertical' | 'horizontal';
}) {
  return (
    <div
      data-invalid={dataInvalid ? true : undefined}
      data-orientation={orientation}
      className={`flex flex-col gap-1 ${
        orientation === 'horizontal' ? 'flex-row items-center' : ''
      }`}
      {...props}
    >
      {children}
    </div>
  );
}

export function FieldLabel({
  htmlFor,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium" {...props}>
      {children}
    </label>
  );
}

export function FieldDescription({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="text-xs text-muted-foreground" {...props}>
      {children}
    </div>
  );
}

export function FieldError({
  children,
  errors,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { errors?: any }) {
  const errorMsg = errors
    ? Array.isArray(errors)
      ? errors[0]?.message
      : errors?.message
    : children;
  if (!errorMsg) return null;
  return (
    <div className="text-sm text-red-500" {...props}>
      {errorMsg}
    </div>
  );
}

export function FieldGroup({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex flex-col gap-4" {...props}>
      {children}
    </div>
  );
}

export function FieldSet({
  children,
  ...props
}: React.FieldsetHTMLAttributes<HTMLFieldSetElement>) {
  return (
    <fieldset className="border-none p-0 m-0" {...props}>
      {children}
    </fieldset>
  );
}

export function FieldLegend({ children, ...props }: React.HTMLAttributes<HTMLLegendElement>) {
  return (
    <legend className="text-base font-semibold mb-2" {...props}>
      {children}
    </legend>
  );
}
