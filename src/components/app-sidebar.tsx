"use client";

import * as React from "react"
import { Calendars } from "@/components/calendars"
import { DatePicker } from "@/components/date-picker"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { User } from "@/types/user"
import type { Instrument } from "@/types/instrument"
import packageConfig from "../../package.json" with { type: "json" };
import Link from "next/link";

export function AppSidebar({ user, instruments, ...props }: React.ComponentProps<typeof Sidebar> & { user: User | null, instruments: Instrument[] }) {
  const data = {
    calendars: [
      {
        name: "Instruments",
        items: instruments,
      }
    ]
  }
  const version = packageConfig.version;
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
      <SidebarFooter className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-gray-500">
        <Link className="hover:underline" href="https://github.com/antoineFabr/salle-hemu">Source code</Link>
        <p>v{version}</p>
        <p>© 2026 - No right reserved :)</p>

      </SidebarFooter>
    </Sidebar>
  )
}
