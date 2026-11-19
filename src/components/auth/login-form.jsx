"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Field from "@/components/auth/auth-field";
import { authClient } from "@/lib/auth-client";

export default function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    const email = data.get("email").trim();
    const password = data.get("password");
    setPending(true);
    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        toast.error(result.error.message || "Please check your details and try again.");
        return;
      }
      toast.success("Welcome back!");
      router.replace("/");
    } catch {
      toast.error("Could not reach Commonplace. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <form className="mt-5 space-y-[18px]" onSubmit={handleLogin}>
        <Field label="Email address" name="email" icon={Mail} type="email" autoComplete="email" placeholder="you@example.com" required />
        <Field label="Password" name="password" icon={KeyRound} type="password" required placeholder="Enter your password"
          autoComplete="current-password" />
        <Button type="submit" disabled={pending} className="h-[54px] w-full justify-between rounded-xl px-5 font-bold">
          {pending ? "Please wait…" : "Log in"} <ArrowRight aria-hidden="true" />
        </Button>
      </form>
      <p className="mt-5 hidden text-center text-xs text-muted-foreground sm:block">OR CONTINUE WITH</p>
      <Button variant="secondary" className="mt-4 h-[52px] w-full gap-4 rounded-xl font-bold" onClick={() => toast("Google sign-in is not available yet.")}>
        <span aria-hidden="true" className="text-lg text-coral">G</span> Continue with Google
      </Button>
      <p className="mt-5 text-sm sm:text-center">
        New here?{" "}
        <Link className="ml-1 font-bold hover:underline" href="/signup">
          Create an account →
        </Link>
      </p>
    </>
  );
}
