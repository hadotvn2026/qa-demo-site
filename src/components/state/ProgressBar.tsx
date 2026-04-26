import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value?: number;
  label?: string;
  className?: string;
  showValue?: boolean;
}

export function ProgressBar({ value, label, className, showValue = true }: ProgressBarProps) {
  const isIndeterminate = value === undefined;

  return (
    <div className={cn("space-y-2 w-full", className)}>
      <div className="flex items-center justify-between">
        {label && <span className="text-xs font-medium text-muted-foreground">{label}</span>}
        {!isIndeterminate && showValue && (
          <span className="text-xs font-medium text-primary">{Math.round(value)}%</span>
        )}
      </div>
      <Progress
        value={value}
        className={cn(
          "h-1.5",
          isIndeterminate && "animate-pulse"
        )}
      />
    </div>
  );
}
