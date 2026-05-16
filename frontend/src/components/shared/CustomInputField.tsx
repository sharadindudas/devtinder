import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type ComponentProps } from "react";

interface CustomInputFieldProps extends ComponentProps<typeof Input> {
  isError?: boolean;
}

export default function CustomInputField({ isError, className, ...props }: CustomInputFieldProps) {
  return (
    <Input
      {...props}
      className={cn("h-12 rounded-md", className, isError && "border-destructive focus-visible:ring-destructive")}
    />
  );
}

