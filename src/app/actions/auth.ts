"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirect") as string | null;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const params = new URLSearchParams({ error: error.message });
    if (redirectTo) params.set("redirect", redirectTo);
    redirect(`/sign-in?${params.toString()}`);
  }

  redirect(redirectTo || "/app");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    redirect(`/sign-up?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/sign-in?message=Check your email to confirm your account");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function signInAsDemo() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: "demo@heliotrail.com",
    password: "demo1234",
  });

  if (error) {
    redirect(`/sign-in?error=${encodeURIComponent("Demo account not available. Please contact support.")}`);
  }

  redirect("/app");
}
