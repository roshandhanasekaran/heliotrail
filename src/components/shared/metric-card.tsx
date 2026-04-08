import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, unit, icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-4">
        {icon && (
          <div className="mt-0.5 flex-shrink-0 text-primary">{icon}</div>
        )}
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-0.5 text-2xl font-semibold tracking-tight">
            {value}
            {unit && (
              <span className="ml-1 text-base font-normal text-muted-foreground">
                {unit}
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
