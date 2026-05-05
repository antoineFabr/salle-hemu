import { api } from "@/lib/api";
import { auth } from "./auth";
import * as cheerio from "cheerio";

export async function reservation(start: Date, end: Date, date: Date, salleId: string, comment: string) {
  const session = await auth();

  if (!session?.phpCookie) {
    return "null";
  }
  const url = `https://salles.hemu-cl.ch/planning/_iframes/reservation.php?idReservation=0&idSalle=185&heureDebut=915&heureFin=915&position=2026-05-07`
  const response = await api.get(url, {
    headers: {
      Cookie: session.phpCookie
    }
  });
  const $ = cheerio.load(response.data);
  const userId = $('#idUtilisateur').val();

  const startHourH = start.getHours().toString();
  const startHourM = start.getMinutes().toString().padStart(2, '0');
  const startHour = `${start.getHours()}${startHourM}`;
  const endHourH = end.getHours().toString();
  const endHourM = end.getMinutes().toString().padStart(2, '0');
  const endHour = `${end.getHours()}${endHourM}`;
  const today = new Date();

  today.setDate(today.getDate() - 1);

  const annee = today.getFullYear();

  const mois = String(today.getMonth() + 1).padStart(2, '0');
  const jour = String(today.getDate()).padStart(2, '0');

  const todayFormat = `${annee}-${mois}-${jour}`;

  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
  const params = new URLSearchParams();
  params.append('id', '0');
  params.append('position', '');
  params.append('idScolaris', '');
  params.append('idDiese', '');
  params.append('idSalle', salleId);
  params.append('idUtilisateur', userId ? userId.toString() : "");
  params.append('alias', '');
  params.append('autreClePrendre', '');
  params.append('heureDebut', startHour);
  params.append('heureDebutH', startHourH);
  params.append('heureDebutM', startHourM);
  params.append('heureFin', endHour);
  params.append('heureFinH', endHourH);
  params.append('heureFinM', endHourM);
  params.append('dateDebut', formattedDate);
  params.append('raisonEnseignant', '0');
  params.append('periodicite', 'unique');
  params.append('dateFin', formattedDate);
  params.append('commentaire', comment);
  params.append('ajouter', 'vérifier et enregistrer ma réservation');

  const res = await api.post(`https://salles.hemu-cl.ch/planning/_iframes/reservation.php?idReservation=0&idSalle=${salleId}&heureDebut=${startHour}&heureFin=${endHour}&position=${todayFormat}`, params ,{
    headers: {
      Cookie: session.phpCookie
    }
  })

  const c = cheerio.load(res.data)

  if (res.data.includes("color:#f00")) {
    return false
  } else {
    return true
  }

}
