"use client";
import { DayPilotCalendar, DayPilot } from "@daypilot/daypilot-lite-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Salle } from "@/types/planning";
import { toColumns, toEvents } from "@/services/schedule";
import { useLoading } from "@/context/loading"
import LoadingDashboard from "@/app/dashboard/loading"
import { useReserve } from "@/context/reserve";

type Props = { salles: Salle[] };

export function RoomScheduler({ salles }: Props) {
  const { isOpen, setIsOpen, setForm } = useReserve();
  const searchParams = useSearchParams();
  const dateString = searchParams.get("date");
  const date = dateString ? new Date(dateString) : new Date();
  const startDate = date.toISOString().split("T")[0];

  const [offset, setOffset] = useState(0);
  const [columnsCount, setColumnsCount] = useState(10);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumnsCount(3);
      } else if (width < 1024) {
        setColumnsCount(5);
      } else {
        setColumnsCount(10);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allColumns = toColumns(salles);
  const allEvents = toEvents(salles, date);

  const visibleColumns = allColumns.slice(offset, offset + columnsCount);
  const visibleSalleIds = new Set(visibleColumns.map((c) => c.id));
  const visibleEvents = allEvents.filter((e) => visibleSalleIds.has(e.resource));

  const canPrev = offset > 0;
  const canNext = offset + columnsCount < allColumns.length;
  const { isPending } = useLoading();

  if (isPending) return <LoadingDashboard />;

  const handleTimeRangeSelected = (args: DayPilot.CalendarTimeRangeSelectedArgs) => {
    const selectedStart = args.start;
    const selectedEnd = args.end;
    const selectedSalleId = args.resource;
    const hasOverlap = visibleEvents.some((event) => {
      if (event.resource !== selectedSalleId) return false;
      const eventStart = new DayPilot.Date(event.start);
      const eventEnd = new DayPilot.Date(event.end);
      return (selectedStart.getTime() < eventEnd.getTime() && selectedEnd.getTime() > eventStart.getTime());
    });
    if (hasOverlap) {
      alert("Impossible de réserver : cette plage horaire est déjà occupée ou chevauche une autre tâche.");
      args.control.clearSelection();
      return;
    }
    setForm({
      comment: "",
      date: new Date(selectedStart.toString()),
      start: new Date(selectedStart.toString()),
      end: new Date(selectedEnd.toString()),
      salleId: selectedSalleId.toString(),
    })
    setIsOpen(true);

  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b shrink-0">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOffset((o) => Math.max(0, o - columnsCount))}
          disabled={!canPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Salles {offset + 1} – {Math.min(offset + columnsCount, allColumns.length)} / {allColumns.length}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOffset((o) => Math.min(allColumns.length - columnsCount, o + columnsCount ))}
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
          onEventClick={(args) => {
          }}
          timeRangeSelectedHandling="Enabled"
          onTimeRangeSelected={handleTimeRangeSelected}
          eventMoveHandling="Disabled"
          eventResizeHandling="Disabled"
          businessBeginsHour={7}
          businessEndsHour={22}
          height={undefined}
        />
      </div>
    </div>
  );
}
