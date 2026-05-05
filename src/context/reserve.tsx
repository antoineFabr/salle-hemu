"use client";

import { createContext, useContext, useState } from "react";

interface ReserveContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReserveContext = createContext<ReserveContextType | undefined>(undefined);

export function ReserveProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ReserveContext.Provider value={{ isOpen, setIsOpen }}>
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
