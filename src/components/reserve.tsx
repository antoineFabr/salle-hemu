"use client"

import { useReserve } from "@/context/reserve";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "./ui/sheet"
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react"
import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { reservation } from "@/services/reservation";
import { useRouter } from "next/navigation";

export function ReserveSheet() {
  const [open, setOpen] = useState(false)
  const { isOpen, setIsOpen, form, setForm } = useReserve();
  const router = useRouter()

  const handleReserve = async () => {
    const res = await reservation(form.start, form.end, form.date, form.salleId, form.comment)
    if (res) {
      setOpen(false)
      router.refresh()
      toast.success("Book successfully", { position: "top-center" })
    } else {
      toast.error("Failed to book", { position: "top-center" })
    }
  }

  const handleTimeChange = (field: "start" | "end", timeString: string) => {
    setForm((prevForm) => {
      if (!prevForm) return prevForm;
      const baseDate = prevForm[field] || prevForm.date || new Date();
      const newDate = new Date(baseDate);
      if (timeString) {
        const [hours, minutes, seconds = 0] = timeString.split(":").map(Number);
        const roundedMinutes = Math.round(minutes / 15) * 15;
        newDate.setHours(hours, roundedMinutes, 0);
      }
      return {
        ...prevForm,
        [field]: newDate,
      };
    });
  };
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Réservation</SheetTitle>
          <SheetDescription>
            Room : {form?.salleId}
          </SheetDescription>
        </SheetHeader>
        <FieldGroup className="mx-auto max-w-xs grid flex-1 auto-rows-min gap-6 px-4">
              <Field className="grid gap-3">
                <FieldLabel htmlFor="date-picker-optional">Date</FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker-optional"
                      className="w-32 justify-between font-normal"
                    >
                      {form?.date ? format(form.date, "PPP") : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form?.date}
                      captionLayout="dropdown"
                      defaultMonth={form?.date}
                      onSelect={(date) => {
                        if (date) {
                          setForm((prevForm) => {
                            return {
                              ...prevForm,
                              date: date,
                            };
                          })
                          setOpen(false)
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
              <Field className="grid gap-3">
                <FieldLabel htmlFor="time-picker-optional">Start</FieldLabel>
                <Input
                  type="time"
                  id="time-start"
                  step="900"
                  value={form?.end ? format(form.start, "HH:mm") : ""}
                  onChange={(e) => handleTimeChange("start", e.target.value)}
                  className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </Field>
              <Field className="w-32">
                <FieldLabel htmlFor="time-picker-optional">End</FieldLabel>
                <Input
                  type="time"
                  id="time-end"
                  step="900"
                  value={form?.end ? format(form.end, "HH:mm") : ""}
                  onChange={(e) => handleTimeChange("end", e.target.value)}
                  className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </Field>
              <Field className="grid gap-3">
                <FieldLabel htmlFor="feedback">Description</FieldLabel>
              <Textarea
                value={form?.comment}
                onChange={(e) => {
                  setForm((prevForm) => {
                    return {
                      ...prevForm,
                      comment: e.target.value,
                    }
                  })
                }}
                id="description"
                placeholder="Add some description to your reservation"
                rows={4}
                />
              </Field>
            </FieldGroup>
        <SheetFooter>
          <Button onClick={handleReserve} className="cursor-pointer p-6">
            Book
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
