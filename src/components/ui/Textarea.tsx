import React, { TextareaHTMLAttributes, useId } from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-slate-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          disabled={disabled}
          rows={props.rows || 3}
          className={cn(
            'block w-full rounded-lg border text-sm transition-colors py-2.5 px-3.5 bg-white text-slate-900',
            'focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600',
            'disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed',
            error
              ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
              : 'border-slate-300',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-600 mt-1" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
