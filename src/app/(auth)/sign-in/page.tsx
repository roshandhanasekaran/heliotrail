import type { Metadata } from "next";
import Link from "next/link";
import { signIn, signInAsDemo } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; redirect?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="w-full max-w-sm">
      <div className="clean-card p-6">
        <h1 className="text-xl font-bold text-[#0D0D0D]">Sign in</h1>
        <p className="mt-1 text-sm text-[#737373]">
          Access your HelioTrail workspace
        </p>

        {params.error && (
          <div className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {params.error}
          </div>
        )}

        {params.message && (
          <div className="mt-4 border border-[#22C55E]/20 bg-[#E8FAE9] px-3 py-2 text-sm text-[#0D0D0D]">
            {params.message}
          </div>
        )}

        <form action={signIn} className="mt-6 space-y-4">
          {params.redirect && (
            <input type="hidden" name="redirect" value={params.redirect} />
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-[#737373]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              className="mt-1 block w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] placeholder:text-[#A3A3A3] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-[#737373]"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="mt-1 block w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] placeholder:text-[#A3A3A3] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
            />
          </div>

          <button
            type="submit"
            className="cta-primary w-full justify-center text-sm"
          >
            Sign In
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-[#D9D9D9]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-[#737373]">or</span>
          </div>
        </div>

        {/* Demo login */}
        <form action={signInAsDemo}>
          <button type="submit" className="cta-secondary w-full justify-center text-sm">
            <span>Sign in as Demo User</span>
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-sm text-[#737373]">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-[#0D0D0D] underline underline-offset-4 hover:text-[#22C55E]"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
