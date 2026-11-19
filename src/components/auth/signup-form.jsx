"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CircleUser, ImageIcon, KeyRound, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Field from "@/components/auth/auth-field";
import { authClient } from "@/lib/auth-client";

export default function SignupForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignup(event) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    const email = data.get("email").trim();
    const password = data.get("password");
    setPending(true);
    try {
      const name = data.get("name").trim();
      if (!name) {
        toast.error("Enter your full name.");
        return;
      }
      const result = await authClient.signUp.email({
        name, email, password, image: data.get("image").trim() || undefined,
      });

      console.log("Signup result:", result);
      if (result.error) {
        toast.error(result.error.message || "Please check your details and try again.");
        return;
      }
      toast.success("Account created.");
      router.replace("/");
    } catch {
      toast.error("Could not reach Commonplace. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <form className="mt-5 space-y-[18px]" onSubmit={handleSignup}>
        <Field label="Full name" name="name" icon={CircleUser} autoComplete="name" placeholder="Your full name" required />
        <Field label="Email address" name="email" icon={Mail} type="email" autoComplete="email" placeholder="you@example.com" required />
        <Field label="Profile photo URL" name="image" icon={ImageIcon} type="url" placeholder="https://example.com/avatar.jpg" aria-describedby="photo-help" />
        <p id="photo-help" className="text-xs text-muted-foreground">Optional. You can leave this field empty.</p>
        <Field label="Password" name="password" icon={KeyRound} type="password" required placeholder="Enter your password"
          autoComplete="new-password"
          pattern="(?=.*[A-Z])(?=.*[a-z]).{6,}"
          title="Use at least 6 characters with an uppercase and a lowercase letter."
          aria-describedby="password-help" />
        <div id="password-help" className="space-y-1 text-[13px]">
          <p className="text-xs text-muted-foreground">Password must include</p>
          <p>✓ An uppercase letter (A–Z)</p>
          <p>✓ A lowercase letter (a–z)</p>
          <p>✓ At least 6 characters</p>
        </div>
        <Button type="submit" disabled={pending} className="h-[54px] w-full justify-between rounded-xl px-5 font-bold">
          {pending ? "Please wait…" : "Register"} <ArrowRight aria-hidden="true" />
        </Button>
      </form>
      <p className="mt-5 text-sm">
        Already have an account?{" "}
        <Link className="ml-1 font-bold hover:underline" href="/login">
          Log in here →
        </Link>
      </p>
    </>
  );
}
