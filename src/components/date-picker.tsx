"use client";
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useLoading } from "@/context/loading";

export function DatePicker() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { startTransition } = useLoading();

  const date = React.useMemo(() => {
    const dateString = searchParams.get('date');
    return dateString ? new Date(dateString) : new Date();
  }, [searchParams]);

  const handleSelect = (newDate: Date | undefined) => {
    if (!newDate) return;
    const params = new URLSearchParams(searchParams.toString());
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    params.set('date', `${year}-${month}-${day}`);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          className="[&_[role=gridcell]]:w-[33px] [&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground"
        />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
