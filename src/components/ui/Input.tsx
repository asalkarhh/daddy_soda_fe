import React, { InputHTMLAttributes, useId } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      rightElement,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'block w-full rounded-lg border text-sm transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600',
              'disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed',
              error
                ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400',
              leftIcon ? 'pl-10' : 'pl-3.5',
              rightElement || rightIcon ? 'pr-11' : 'pr-3.5',
              'py-2.5',
              className
            )}
            {...props}
          />
          {rightElement ? (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              {rightElement}
            </div>
          ) : rightIcon ? (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              {rightIcon}
            </div>
          ) : null}
        </div>
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

Input.displayName = 'Input';
