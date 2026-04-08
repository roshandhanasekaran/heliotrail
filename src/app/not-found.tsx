import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-heading text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className={buttonVariants({ className: "mt-6" })}>
        Go Home
      </Link>
    </div>
  );
}
