import { type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import type { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

interface CustomInputFieldProps extends ComponentProps<typeof Input> {
  isError?: FieldError;
}

export default function CustomInputField({ isError, className, ...props }: CustomInputFieldProps) {
  return (
    <Input
      {...props}
      className={cn("h-12 rounded-md", className, isError && "border-destructive focus-visible:ring-destructive")}
    />
  );
}

