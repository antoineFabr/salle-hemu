import { ReserveProvider } from "@/context/reserve";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ReserveProvider>
        {children}
      </ReserveProvider>
    </div>
  );
}
