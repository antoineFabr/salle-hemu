"use client"

import { useReserve } from "@/context/reserve";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "./ui/sheet"

export function ReserveSheet() {
  const { isOpen, setIsOpen } = useReserve();
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Réservation</SheetTitle>
          <SheetDescription>
            Détails de l'événement sélectionné.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
