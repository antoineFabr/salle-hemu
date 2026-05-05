// utils/scheduler-adapter.ts
import { Salle } from "@/types/planning";

export type DayPilotColumn = {
  name: string;
  id: string;
};

export type DayPilotEvent = {
  id: string;
  text: string;
  start: string;
  end: string;
  resource: string;
  backColor?: string;
  data: {
    type: string;
    statutCle?: string | null;
  };
};

const TYPE_COLORS: Record<string, string> = {
  reservation: "#3b82f6",
  libre:       "#22c55e",
  limitation:  "#f59e0b",
  ferme:       "#ef4444",
};

export function toColumns(salles: Salle[]): DayPilotColumn[] {
  return salles.map((s) => ({ name: s.nom, id: s.idSalle }));
}

function parseHeure(heure: string): string {
  const normalized = heure.replace("h", ":");
  const [h, m] = normalized.split(":").map(Number);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function toEvents(salles: Salle[], date: Date): DayPilotEvent[] {
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const events: DayPilotEvent[] = [];

  for (const salle of salles) {
    for (const plage of salle.plages) {
      if (!plage.heureDebut || !plage.heureFin) continue;

      const heureDebut = parseHeure(plage.heureDebut);
      const heureFin = parseHeure(plage.heureFin);


      events.push({
        id: plage.idReservation ?? `${salle.idSalle}-${heureDebut}`,
        text: plage.titre ?? plage.type,
        start: `${dateStr}T${heureDebut}:00`,
        end: `${dateStr}T${heureFin}:00`,
        resource: salle.idSalle,
        backColor: plage.couleur ?? TYPE_COLORS[plage.type],
        data: {
          type: plage.type,
          statutCle: plage.statutCle,
        },
      });
    }
  }

  return events;
}
