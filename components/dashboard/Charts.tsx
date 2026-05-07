"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const riskColors = ["#10b981", "#facc15", "#fb923c", "#ef4444", "#0891b2", "#1d4ed8"];

export function RiskDistributionChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={88} label>
          {data.map((_, index) => (
            <Cell key={index} fill={riskColors[index % riskColors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function IncidentTrendChart({ data }: { data: { month: string; incidents: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="incidents" stroke="#0e7490" fill="#cffafe" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MaintenanceBudgetChart({ data }: { data: { name: string; budget: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="budget" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AssetHealthChart({ data }: { data: { month: string; index: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis domain={[60, 100]} />
        <Tooltip />
        <Line type="monotone" dataKey="index" stroke="#059669" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ParetoCurveChart({ data }: { data: { cumulativeCost: number; cumulativeRiskReduction: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="cumulativeCost" tickFormatter={(value: number) => `${Math.round(value / 1_000_000)}ลบ.`} />
        <YAxis />
        <Tooltip formatter={(value: number) => value.toLocaleString("th-TH")} />
        <Line type="monotone" dataKey="cumulativeRiskReduction" stroke="#0e7490" strokeWidth={3} dot />
      </LineChart>
    </ResponsiveContainer>
  );
}
