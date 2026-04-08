import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export function CTAFooter() {
  return (
    <section className="border-t border-border bg-primary/5">
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to see it in action?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Explore a fully populated demo passport with real specifications,
          certifications, material data, and circularity information.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/passport/topcon-550-bf-2026-001"
            className={buttonVariants({ size: "lg" })}
          >
            View TOPCon 550W Passport
            <ArrowRightIcon className="ml-1.5 h-4 w-4" />
          </Link>
          <Link
            href="/passport/hjt-420-2026-003"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            View HJT 420W Passport
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Three demo passports available: TOPCon 550W, PERC 450W, HJT 420W
        </p>
      </div>
    </section>
  );
}
