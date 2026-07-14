"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { DepthCard } from "@/components/ui/depth-card";

const COLORS = ["#E8A317", "#C9A227", "#8b8b95", "#3B82F6", "#10B981", "#8B5CF6"];

interface BudgetChartProps {
  title: string;
  data: { category: string; amount: number; percentage: number }[];
}

export function BudgetChart({ title, data }: BudgetChartProps) {
  return (
    <DepthCard tilt={false} innerClassName="h-full">
      <div className="p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {title}
        </p>
        <div className="mt-4 h-[240px] w-full">
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
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
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
                  background: "#111113",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  color: "#f4f4f5",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${value ?? 0} UCT`, "Amount"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((item, i) => (
            <div key={item.category} className="flex items-center gap-2 text-xs">
              <div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="truncate text-muted-foreground">
                {item.category}
              </span>
              <span className="ml-auto font-mono font-medium tabular-nums">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </DepthCard>
  );
}