"use client";

import * as React from "react"
import { Check, ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import { Instrument } from "@/types/instrument";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useLoading } from "@/context/loading";

interface CalendarsProps {
  calendars: {
    name: string
    items: Instrument[]
  }[]
  onCalendarChange?: (item: Instrument, isSelected: boolean, allSelected: Instrument[]) => void
}

export function Calendars({ calendars, onCalendarChange }: CalendarsProps) {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startTransition } = useLoading();

  const [selectedItems, setSelectedItems] = useState<Instrument[]>(() => {
    const ids = searchParams.get("instrument")?.split(",").filter(Boolean) ?? [];
    const allItems = calendars.flatMap((c) => c.items);
    return allItems.filter((item) => ids.includes(item.id));
  });

  useEffect(() => {
    const ids = searchParams.get("instrument")?.split(",").filter(Boolean) ?? [];
    const allItems = calendars.flatMap((c) => c.items);
    setSelectedItems(allItems.filter((item) => ids.includes(item.id)));
  }, [searchParams, calendars]);

  const selectedIds = selectedItems.map((i) => i.id);

  const handleToggle = (item: Instrument) => {
    const isCurrentlySelected = selectedIds.includes(item.id);

    const newSelected = isCurrentlySelected
      ? selectedItems.filter((i) => i.id !== item.id)
      : [...selectedItems, item];

    setSelectedItems(newSelected);

    const params = new URLSearchParams(searchParams.toString());
    params.set("instrument", newSelected.map((i) => i.id).join(","));
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });

    onCalendarChange?.(item, !isCurrentlySelected, newSelected);
  };

  const handleToggleCategory = (categoryItems: Instrument[]) => {
    const isAllSelected = categoryItems.every((item) => selectedIds.includes(item.id));

    const newSelected = isAllSelected
      ? selectedItems.filter((item) => !categoryItems.some(cItem => cItem.id === item.id))
      : [...selectedItems, ...categoryItems.filter((item) => !selectedIds.includes(item.id))];

    setSelectedItems(newSelected);

    const params = new URLSearchParams(searchParams.toString());
    params.set("instrument", newSelected.map((i) => i.id).join(","));
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });

    onCalendarChange?.(categoryItems[0], !isAllSelected, newSelected);
  };

  return (
    <>
      {calendars.map((calendar, index) => {
        const groupedItems = calendar.items.reduce((acc, item) => {
          const category = item.category || "Autres";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(item);
          return acc;
        }, {} as Record<string, Instrument[]>);

        return (
          <React.Fragment key={calendar.name}>
            <SidebarGroup className="py-0">
              <Collapsible
                defaultOpen={index === 0}
                className="group/collapsible"
              >
                <SidebarGroupLabel
                  asChild
                  className="group/label w-full text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <CollapsibleTrigger>
                    {calendar.name}{" "}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {Object.entries(groupedItems).map(([categorie, instruments], catIndex) => {
                        const isCategoryFullySelected = instruments.every(item => selectedIds.includes(item.id));
                        return (
                          <Collapsible
                            key={categorie}
                            defaultOpen={catIndex === 0}
                            className="group/subcollapsible mt-1"
                          >
                            <div className="flex items-center w-full px-2 py-1.5 hover:bg-sidebar-accent rounded-md transition-colors">
                              <button
                                type="button"
                                onClick={() => handleToggleCategory(instruments)}
                                className="flex items-center gap-2 flex-1 text-sidebar-foreground hover:text-sidebar-accent-foreground"
                              >
                                <div
                                  data-active={isCategoryFullySelected}
                                  className="group/calendar-item flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border border-sidebar-border text-sidebar-primary-foreground data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-primary"
                                >
                                  <Check className="hidden size-3 group-data-[active=true]/calendar-item:block" />
                                </div>
                                <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
                                  {categorie}
                                </span>
                              </button>
                              <CollapsibleTrigger className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-md">
                                <ChevronRight className="size-4 text-sidebar-foreground/50 transition-transform group-data-[state=open]/subcollapsible:rotate-90" />
                              </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent>
                              <div className="pl-6 pr-2 py-1">
                                {instruments.map((item) => {
                                  const isActive = selectedIds.includes(item.id);
                                  return (
                                    <SidebarMenuItem key={item.id} className="list-none">
                                      <SidebarMenuButton onClick={() => handleToggle(item)}>
                                        <div
                                          data-active={isActive}
                                          className="group/calendar-item flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border border-sidebar-border text-sidebar-primary-foreground data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-primary"
                                        >
                                          <Check className="hidden size-3 group-data-[active=true]/calendar-item:block" />
                                        </div>
                                        {item.name}
                                      </SidebarMenuButton>
                                    </SidebarMenuItem>
                                  )
                                })}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
            <SidebarSeparator className="mx-0" />
          </React.Fragment>
        )
      })}
    </>
  )
}
