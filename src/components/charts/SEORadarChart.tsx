import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from "recharts";

interface RadarData {
  subject: string;
  value: number;
  fullMark: number;
}

interface SEORadarChartProps {
  data: RadarData[];
  height?: number;
}

export function SEORadarChart({ data, height = 300 }: SEORadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontFamily: "Inter" }}
        />
        <Radar
          name="Score"
          dataKey="value"
          stroke="hsl(var(--accent))"
          fill="hsl(var(--accent))"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "12px",
            fontSize: 12,
            fontFamily: "Inter",
            boxShadow: "var(--shadow-lg)",
          }}
          labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
