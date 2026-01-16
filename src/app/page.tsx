import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-6xl font-bold tracking-tight text-slate-900">
          Canopy
        </h1>
        <p className="text-xl text-slate-600">
          The single, structured, client-visible workspace for your projects.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/getting_started">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
