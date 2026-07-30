"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  MEMBER_ATTENDANCE_KEYS,
  MEMBER_ATTENDANCE_LABELS,
} from "@/lib/attendance/member-status";

export function MemberStatusFilter() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const current = searchParams.get("status") ?? "ALL";

  const onValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "ALL") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    params.set("page", "1");
    router.push(`${pathName}?${params.toString()}`);
  };

  return (
    <Select value={current} onValueChange={onValueChange}>
      <SelectTrigger className="h-9 w-[190px]">
        <SelectValue placeholder="All statuses" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All statuses</SelectItem>
        {MEMBER_ATTENDANCE_KEYS.map((key) => (
          <SelectItem key={key} value={key}>
            {MEMBER_ATTENDANCE_LABELS[key]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
