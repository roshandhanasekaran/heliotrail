import type { Metadata } from "next";
import Link from "next/link";
import { signUp } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="w-full max-w-sm">
      <div className="clean-card p-6">
        <h1 className="text-xl font-bold text-[#0D0D0D]">Create account</h1>
        <p className="mt-1 text-sm text-[#737373]">
          Get started with HelioTrail
        </p>

        {params.error && (
          <div className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {params.error}
          </div>
        )}

        <form action={signUp} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="full_name"
              className="block text-xs font-semibold uppercase tracking-wider text-[#737373]"
            >
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              autoComplete="name"
              placeholder="Jane Smith"
              className="mt-1 block w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] placeholder:text-[#A3A3A3] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
            />
          </div>

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
              autoComplete="new-password"
              minLength={8}
              placeholder="Min. 8 characters"
              className="mt-1 block w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] placeholder:text-[#A3A3A3] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
            />
          </div>

          <button
            type="submit"
            className="cta-primary w-full justify-center text-sm"
          >
            Create Account
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-sm text-[#737373]">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-[#0D0D0D] underline underline-offset-4 hover:text-[#22C55E]"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
