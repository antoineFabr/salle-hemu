import { Suspense } from "react";
import { DashBoard } from "@/components/dashboard";
import { getUserName } from "@/services/user";
import { extractPlanning } from "@/services/planning";
import { getInstruments } from "@/services/instrument";
import { getHTML } from "@/services/dom";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const dateString = typeof params.date === 'string' ? params.date : undefined;
  const instrumentIds = typeof params.instrument === 'string' ? params.instrument : undefined;
  const html = await getHTML({
    date: dateString ? new Date(dateString) : undefined,
    instruments: instrumentIds ? instrumentIds : undefined,
  })

  const [user, planning, instruments] = await Promise.all([
    getUserName(html),
    extractPlanning(html),
    getInstruments(html)
  ]);

  return (
    <DashBoard
      user={user}
      planning={planning}
      instruments={instruments}
    />
  );
}
