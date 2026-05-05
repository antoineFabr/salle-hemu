"use client";
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Salle } from "@/types/planning";
import { toColumns, toEvents } from "@/services/schedule";
import { useLoading } from "@/context/loading"
import LoadingDashboard from "@/app/dashboard/loading"

const COLONNES_VISIBLES = 10;

type Props = { salles: Salle[] };

export function RoomScheduler({ salles }: Props) {
  const searchParams = useSearchParams();
  const dateString = searchParams.get("date");
  const date = dateString ? new Date(dateString) : new Date();
  const startDate = date.toISOString().split("T")[0];

  const [offset, setOffset] = useState(0);

  const allColumns = toColumns(salles);
  const allEvents = toEvents(salles, date);

  const visibleColumns = allColumns.slice(offset, offset + COLONNES_VISIBLES);
  const visibleSalleIds = new Set(visibleColumns.map((c) => c.id));
  const visibleEvents = allEvents.filter((e) => visibleSalleIds.has(e.resource));

  const canPrev = offset > 0;
  const canNext = offset + COLONNES_VISIBLES < allColumns.length;
  const { isPending } = useLoading();

  if (isPending) return <LoadingDashboard />;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b shrink-0">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOffset((o) => Math.max(0, o - COLONNES_VISIBLES))}
          disabled={!canPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Salles {offset + 1} – {Math.min(offset + COLONNES_VISIBLES, allColumns.length)} / {allColumns.length}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOffset((o) => Math.min(allColumns.length - COLONNES_VISIBLES, o + COLONNES_VISIBLES ))}
          disabled={!canNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <DayPilotCalendar
          theme="root"
          eventBorderRadius={0}
          viewType="Resources"
          startDate={startDate}
          columns={visibleColumns}
          events={visibleEvents}
          headerDateFormat=""
          eventMoveHandling="Disabled"
          eventResizeHandling="Disabled"
          timeRangeSelectedHandling="Disabled"
          businessBeginsHour={7}
          businessEndsHour={22}
          height={undefined}
        />
      </div>
    </div>
  );
}
