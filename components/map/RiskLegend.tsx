export function RiskLegend() {
  const items = [
    { label: "ต่ำ", color: "bg-emerald-500" },
    { label: "ปานกลาง", color: "bg-yellow-400" },
    { label: "สูง", color: "bg-orange-500" },
    { label: "วิกฤต", color: "bg-red-600" }
  ];
  return (
    <div className="rounded-lg border bg-white p-3 text-xs shadow-sm">
      <p className="mb-2 font-semibold">ระดับความเสี่ยง</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${item.color}`} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
