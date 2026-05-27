import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { type ComponentProps } from "react";

interface CustomTextareaProps extends ComponentProps<typeof Textarea> {
  isError?: boolean;
}

export default function CustomTextarea({ isError, className, ...props }: CustomTextareaProps) {
  return (
    <Textarea
      {...props}
      className={cn("min-h-32", className, isError && "border-destructive focus-visible:ring-destructive")}
    />
  );
}

