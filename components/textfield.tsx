import React, { InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      error,
      fullWidth = false,
      startIcon,
      endIcon,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? "w-full" : "max-w-sm"}`}>
        {label && (
          <label
            htmlFor={props.id}
            className={twMerge(
              "block text-sm font-medium mb-1.5",
              error ? "text-red-600" : "text-gray-700",
              disabled && "opacity-50"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span
                className={twMerge(
                  "text-gray-500",
                  error && "text-red-500",
                  disabled && "opacity-50"
                )}
              >
                {startIcon}
              </span>
            </div>
          )}
          <input
            ref={ref}
            className={twMerge(
              // Base styles
              "block rounded-md shadow-sm",
              "text-sm",
              "transition-colors duration-200",

              // Border styles
              "border border-gray-300",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary",
              error &&
                "border-red-500 focus:ring-red-500/20 focus:border-red-500",

              // Padding variations based on icons
              startIcon ? "pl-10" : "pl-4",
              endIcon ? "pr-10" : "pr-4",
              "py-2.5",

              // Width
              fullWidth && "w-full",

              // States
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "placeholder:text-gray-400",

              // Custom classes
              className
            )}
            disabled={disabled}
            {...props}
          />
          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span
                className={twMerge(
                  "text-gray-500",
                  error && "text-red-500",
                  disabled && "opacity-50"
                )}
              >
                {endIcon}
              </span>
            </div>
          )}
        </div>
        {helperText && (
          <p
            className={twMerge(
              "mt-1.5 text-sm",
              error ? "text-red-600" : "text-gray-500"
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
