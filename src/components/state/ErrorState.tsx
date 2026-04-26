import { AlertCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  severity?: "error" | "warning";
  message: string;
  recovery?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function ErrorState({
  severity = "error",
  message,
  recovery,
  className,
}: ErrorStateProps) {
  const isError = severity === "error";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border p-6 text-center animate-in slide-in-from-top-2 duration-300",
        isError
          ? "border-destructive/50 bg-destructive/5 text-destructive"
          : "border-warning/50 bg-warning/5 text-warning",
        className
      )}
    >
      <div className="mb-3">
        {isError ? (
          <AlertCircle className="h-6 w-6" />
        ) : (
          <AlertTriangle className="h-6 w-6" />
        )}
      </div>
      <p className="text-sm font-medium">{message}</p>
      {recovery && (
        <Button
          variant="outline"
          size="sm"
          onClick={recovery.onClick}
          className={cn(
            "mt-4 bg-transparent",
            isError
              ? "border-destructive/50 hover:bg-destructive/10 text-destructive"
              : "border-warning/50 hover:bg-warning/10 text-warning"
          )}
        >
          {recovery.label}
        </Button>
      )}
    </div>
  );
}
