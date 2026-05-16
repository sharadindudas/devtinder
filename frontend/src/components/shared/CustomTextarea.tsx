import { type ComponentProps } from "react";
import { Textarea } from "@/components/ui/textarea";
import type { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

interface CustomTextareaProps extends ComponentProps<typeof Textarea> {
  isError?: FieldError;
}

export default function CustomTextarea({ isError, className, ...props }: CustomTextareaProps) {
  return (
    <Textarea
      {...props}
      className={cn("min-h-32", className, isError && "border-destructive focus-visible:ring-destructive")}
    />
  );
}

