"use client";

import * as React from "react"
import { Calendars } from "@/components/calendars"
import { DatePicker } from "@/components/date-picker"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { User } from "@/types/user"
import type { Instrument } from "@/types/instrument"
import { useTransition } from "react";
import LoadingDashboard from "@/app/dashboard/loading";

export function AppSidebar({ user, instruments, ...props }: React.ComponentProps<typeof Sidebar> & { user: User | null, instruments: Instrument[] }) {
  const data = {
    calendars: [
      {
        name: "Instruments",
        items: instruments,
      }
    ]
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={data.calendars} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
