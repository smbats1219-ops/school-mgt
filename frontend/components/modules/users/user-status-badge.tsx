import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserStatus } from "@/lib/types/api";

const statusStyles: Record<UserStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  APPROVED: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  ACTIVE: "bg-sky-100 text-sky-800 hover:bg-sky-100",
  SUSPENDED: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  DEACTIVATED: "bg-slate-200 text-slate-700 hover:bg-slate-200",
};

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return (
    <Badge variant="outline" className={cn(statusStyles[status])}>
      {status}
    </Badge>
  );
}