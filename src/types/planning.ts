export type TypePlage = 'reservation' | 'libre' | 'limitation' | 'ferme';

export type Plage = {
  type: TypePlage;
  colspan: number;
  idReservation?: string;
  titre?: string;
  heureDebut?: string;
  heureFin?: string;
  couleur?: string;
  statutCle?: string | null;
};

export type Salle = {
  idSalle: string;
  nom: string;
  plages: Plage[];
};
