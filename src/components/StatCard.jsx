import { cn } from "./cn";

const StatCard = ({ title, amount, icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200">
    <div className="flex justify-between mb-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <span
        className={cn(
          "text-xs font-bold px-2 py-1 rounded",
          trend.startsWith("+")
            ? "bg-emerald-50 text-emerald-600"
            : "bg-rose-50 text-rose-600"
        )}
      >
        {trend}
      </span>
    </div>
    <p className="text-sm text-slate-500">{title}</p>
    <h3 className="text-2xl font-bold">${amount.toLocaleString()}</h3>
  </div>
);

export default StatCard;
