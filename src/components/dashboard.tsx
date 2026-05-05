"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import type { User } from "@/types/user"
import { Salle } from "@/types/planning"
import { Instrument } from "@/types/instrument"
import { RoomScheduler } from "./scheduler"
import { ReserveSheet } from "./reserve";
import { LoadingProvider } from "@/context/loading";

export function DashBoard({ user, planning, instruments }: { user: User, planning: Salle[], instruments: Instrument[] }) {

  return (
    <LoadingProvider>
      <ReserveSheet/>
      <SidebarProvider>
      <AppSidebar user={user} instruments={instruments}/>
      <SidebarInset>
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>October 2024</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex-1 overflow-hidden">

            <RoomScheduler salles={planning} />

        </div>
      </SidebarInset>
    </SidebarProvider>
    </LoadingProvider>

  )
}
