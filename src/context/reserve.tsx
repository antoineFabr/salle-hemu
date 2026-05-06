"use client";

import { createContext, useContext, useState } from "react";
import type { Reservation } from "@/types/reserevation";

interface ReserveContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: Reservation;
  setForm: React.Dispatch<React.SetStateAction<Reservation>>;
}

const ReserveContext = createContext<ReserveContextType | undefined>(undefined);

export function ReserveProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<Reservation>({
    comment: "",
    date: new Date(),
    end: new Date(),
    start: new Date(),
    salleId: ""
  });

  return (
    <ReserveContext.Provider value={{ isOpen, setIsOpen, form, setForm }}>
      {children}
    </ReserveContext.Provider>
  );
}

export const useReserve = () => {
  const context = useContext(ReserveContext);
  if (context === undefined) {
    throw new Error("useReserve doit être utilisé à l'intérieur d'un ReserveProvider");
  }
  return context;
};
