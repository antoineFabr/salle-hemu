"use server";

import * as cheerio from 'cheerio';
import { Instrument } from '@/types/instrument';

export async function getInstruments(html: string): Promise<Instrument[]> {
  const $ = cheerio.load(html);
  const instruments: Instrument[] = [];

  let categorieCourante = '';

  $('select[name="instrument"] option').each((_, element) => {
    const option = $(element);
    const value = option.attr('value') || '';
    const style = option.attr('style') || '';

    const texteBrut = option.text();
    const nomNettoye = texteBrut.replace(/[\u00a0]/g, '').trim();

    if (value === 'tous') {
      return;
    }

    if (style.includes('font-weight:bold')) {
      categorieCourante = nomNettoye;
    }
    else {
      instruments.push({
        id: value,
        name: nomNettoye,
        category: categorieCourante
      });
    }
  });

  return instruments;
}
