import { cn } from "./cn";

const NavItem = ({ icon, label, active }) => (
  <button
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
      active
        ? "bg-blue-50 text-blue-600"
        : "text-slate-500 hover:bg-slate-50"
    )}
  >
    {icon}
    {label}
  </button>
);

export default NavItem;
