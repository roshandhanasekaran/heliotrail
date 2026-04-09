import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] px-4">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2.5 group">
        <div className="flex h-8 w-8 items-center justify-center bg-[#22C55E] text-[#0D0D0D] transition-opacity group-hover:opacity-80">
          <span className="text-sm font-bold">HT</span>
        </div>
        <span className="text-lg font-bold tracking-tight text-[#0D0D0D]">
          HelioTrail
        </span>
      </Link>

      {children}

      {/* Footer */}
      <p className="mt-8 text-xs text-[#737373]">
        &copy; {new Date().getFullYear()} HelioTrail. Digital Product Passports
        for PV Solar.
      </p>
    </div>
  );
}
