"use server"

import { auth } from "./auth";
import { api } from "@/lib/api";

interface PlanningOptions {
  date?: Date;
  instruments?: string;
}

const formatPlanningDate = (date: Date): string => {
  const day = date.getDate();
  const month = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(date);
  const year = date.getFullYear();

  return `${day}+${month}+${year}`;
};

export async function getHTML(options: PlanningOptions): Promise<string> {
  const session = await auth();

  if (!session?.phpCookie) {
    return "null";
  }

  const baseUrl = "https://salles.hemu-cl.ch/planning/";
  const queryParts: string[] = [];

  if (options.date || options.instruments) {
    queryParts.push("resultat=");
  }

  if (options.date) {
    queryParts.push(`position=${formatPlanningDate(options.date)}`);
  }

  if (options.instruments) {
    queryParts.push(`instrument=${options.instruments}`);
  }

  const finalUrl = queryParts.length > 0
    ? `${baseUrl}?${queryParts.join("&")}`
    : baseUrl;

  const res = await api.get(finalUrl, {
    headers: {
      Cookie: session.phpCookie
    }
  });

  return res.data;
}
