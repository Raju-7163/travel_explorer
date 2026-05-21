import { Compass } from "lucide-react";

export default function PageLoader({ label = "Loading travel experience" }) {
  return (
    <div className="grid min-h-[calc(100vh-74px)] place-items-center bg-stone-50 px-4 dark:bg-slate-950">
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-saffron/10 text-saffron dark:bg-saffron/15">
          <Compass size={30} className="animate-spin motion-reduce:animate-none" />
        </div>
        <p className="mt-5 text-sm font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </p>
      </div>
    </div>
  );
}
