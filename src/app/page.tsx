import Antigravity from "@/components/Antigravity";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden flex flex-col flex-1 items-center justify-center min-h-screen">

      <div className="absolute inset-0 z-0 pointer-events-none">
        <Antigravity
          count={300}
          magnetRadius={12}
          ringRadius={14}
          waveSpeed={0}
          waveAmplitude={5}
          particleSize={0.4}
          lerpSpeed={0.01}
          color="#007a55"
          autoAnimate
          particleVariance={1}
          rotationSpeed={0}
          depthFactor={1}
          pulseSpeed={0}
          particleShape="capsule"
          fieldStrength={10}
       />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight">
          This is an application to book a room at EJMA
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-400">
          Before booking a room, you need to log in with your EJMA account.
        </p>
      </div>

      <div className="relative z-10 flex flex-col gap-4 text-base font-medium sm:flex-row mt-8">
        <Link href={"/login"} className="text-accent-foreground">
        <Button
          className="flex h-12 w-full items-center justify-center gap-2 text-background transition-colors md:w-[158px] cursor-pointer"
        >
            Log in
          </Button>
        </Link>
      </div>
    </div>
  );
}
