"use server";

import * as cheerio from "cheerio"
import type { User } from "@/types/user";

export async function getUserName(html: string): Promise<User> {

  const $ = cheerio.load(html);

  const textePur = $('.nav')
    .contents()
    .filter(function() {
      return this.type === 'text';
    })
    .text()
    .trim();
  const nomComplet = textePur
    .replace('Bonjour', '')
    .replace(',', '')
    .trim();

  return { name: nomComplet }
}
