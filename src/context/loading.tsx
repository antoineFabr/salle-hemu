"use client";
import { createContext, useContext, useTransition, TransitionStartFunction } from "react";

const LoadingContext = createContext<{
  isPending: boolean;
  startTransition: TransitionStartFunction;
}>({
  isPending: false,
  startTransition: (fn) => fn(),
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();

  return (
    <LoadingContext.Provider value={{ isPending, startTransition }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);
