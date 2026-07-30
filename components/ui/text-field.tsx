import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      error = false,
      fullWidth = false,
      startIcon,
      endIcon,
      className,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const helperId = helperText && id ? `${id}-helper` : undefined;

    return (
      <div className={fullWidth ? "w-full" : "max-w-sm"}>
        {label && (
          <label
            htmlFor={id}
            className={twMerge(
              "mb-1.5 block text-sm font-semibold",
              error ? "text-red-700" : "text-slate-700",
              disabled && "opacity-50"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <span
              aria-hidden="true"
              className={twMerge(
                "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400",
                error && "text-red-500",
                disabled && "opacity-50"
              )}
            >
              {startIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            aria-invalid={error || undefined}
            aria-describedby={helperId}
            className={twMerge(
              "block min-h-11 rounded-xl border border-slate-300 bg-white py-2.5 text-sm text-slate-950 shadow-sm transition",
              "placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none",
              startIcon ? "pl-10" : "pl-4",
              endIcon ? "pr-10" : "pr-4",
              fullWidth && "w-full",
              error && "border-red-500 focus:border-red-600 focus:ring-red-500/15",
              "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60",
              className
            )}
            disabled={disabled}
            {...props}
          />
          {endIcon && (
            <span
              aria-hidden="true"
              className={twMerge(
                "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400",
                error && "text-red-500",
                disabled && "opacity-50"
              )}
            >
              {endIcon}
            </span>
          )}
        </div>
        {helperText && (
          <p
            id={helperId}
            className={twMerge(
              "mt-1.5 text-sm leading-5",
              error ? "text-red-700" : "text-slate-500"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
