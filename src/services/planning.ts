"use server";

import * as cheerio from 'cheerio';
import { Salle, Plage } from '@/types/planning';

export async function extractPlanning(html: string): Promise<Salle[]> {
  const $ = cheerio.load(html);
  const salles: Salle[] = [];

  $('tr[data-idsalle]').each((_, trElement) => {
    const tr = $(trElement);
    const idSalle = tr.attr('data-idsalle') || '';

    const nomSalle = ($(`.localLabel[data-idsalle="${idSalle}"] span`).attr('title') || `Salle ${idSalle}`).replace("EJMA-","")
    const plages: Plage[] = [];

    tr.children('td').each((_, tdElement) => {
      const td = $(tdElement);

      const colspan = parseInt(td.attr('colspan') || '1', 10);

      const idReservation = td.attr('data-idreservation');
      const statut = td.attr('data-statut');
      const heure = td.attr('data-heure');

      if (idReservation) {
        const titleAttr = td.attr('title') || '';
        const styleAttr = td.attr('style') || '';

        const matchTitre = titleAttr.match(/(.*?)\s*\(([\d]{1,2}h[\d]{2})\s*-\s*([\d]{1,2}h[\d]{2})\)/);
        let titre = titleAttr;
        let heureDebut = '';
        let heureFin = '';

        if (matchTitre) {
          titre = matchTitre[1].trim();
          heureDebut = matchTitre[2].trim();
          heureFin = matchTitre[3].trim();
        }

        const matchCouleur = styleAttr.match(/background-color:\s*(#[a-fA-F0-9]{3,6})/i);
        const couleur = matchCouleur ? matchCouleur[1] : '#cccccc';

        const statutCle = td.find('span.fa').attr('title') || null;

        plages.push({
          type: 'reservation',
          colspan,
          idReservation,
          titre,
          heureDebut,
          heureFin,
          couleur,
          statutCle
        });
      }
      else if (heure) {
        plages.push({
          type: 'libre',
          colspan,
          heureDebut: td.attr('title')
        });
      }
      else if (statut === 'limitation' || statut === 'ferme') {
        plages.push({
          type: statut,
          colspan,
          titre: td.attr('title') || (statut === 'ferme' ? 'Fermé' : 'Limité')
        });
      }
    });

    salles.push({
      idSalle,
      nom: nomSalle,
      plages
    });
  });

  return salles;
}
