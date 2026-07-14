"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#F59E0B", "#D4AF37", "#71717A", "#3B82F6", "#10B981", "#8B5CF6"];

interface BudgetChartProps {
  title: string;
  data: { category: string; amount: number; percentage: number }[];
}

export function BudgetChart({ title, data }: BudgetChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#18181B",
                  border: "1px solid #27272A",
                  borderRadius: "8px",
                  color: "#FAFAFA",
                }}
                formatter={(value) => [
                  `${value ?? 0} UCT`,
                  "Amount",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item, i) => (
            <div key={item.category} className="flex items-center gap-2 text-xs">
              <div
                className="h-2 w-2 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="text-muted-foreground">{item.category}</span>
              <span className="ml-auto font-medium">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}