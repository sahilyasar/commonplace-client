import { Heart } from "lucide-react";
import SignupForm from "@/components/auth/signup-form";

export const metadata = { title: "Signup | Commonplace" };

export default function SignupPage() {
  return (
    <main id="main-content" className="flex-1 bg-warm px-[18px] py-10 sm:py-16">
      <section className="mx-auto max-w-[558px] sm:rounded-3xl sm:bg-card sm:p-[34px]">
        <div className="mx-auto grid size-[60px] place-items-center rounded-2xl bg-primary text-primary-foreground">
          <Heart className="size-5" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-[clamp(2rem,5vw,2.375rem)] leading-tight sm:text-center">
          Create your account
        </h1>
        <p className="mt-3 text-[15px] text-muted-foreground">
          Join the community and start making a difference.
        </p>
        <SignupForm />
      </section>
    </main>
  );
}
