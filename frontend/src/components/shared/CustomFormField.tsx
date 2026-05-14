import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import type { FieldError } from "react-hook-form";

interface CustomFormField extends ComponentProps<"div"> {
  showLabel?: boolean;
  labelName?: string;
  labelClassName?: string;
  isError?: FieldError;
  errorMessage?: string;
}

export default function CustomFormField({
  id,
  showLabel = true,
  className,
  isError,
  labelName,
  labelClassName,
  children,
  errorMessage
}: CustomFormField) {
  return (
    <div className={cn("space-y-3", className)}>
      {showLabel && (
        <Label
          htmlFor={id}
          className={cn(labelClassName, isError && "text-destructive")}>
          {labelName}
        </Label>
      )}
      {children}
      {isError && <div className="-mt-1.5 text-sm text-destructive">{errorMessage}</div>}
    </div>
  );
}

