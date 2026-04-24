import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceMetricsCardProps {
  label: string;
  value: number | string;
  subtitle?: string;
}

export default function PerformanceMetricsCard({
  label,
  value,
  subtitle,
}: PerformanceMetricsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {typeof value === 'number' ? value.toFixed(2) : value}
        </div>
        {subtitle && (
          <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
        )}
      </CardContent>
    </Card>
  );
}
