import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
}

export function Progress({ value, max = 100 }: ProgressProps) {
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={cn("h-full bg-red-600 transition-all duration-300")}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}
