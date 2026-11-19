import { Heart } from "lucide-react";
import LoginForm from "@/components/auth/login-form";

export const metadata = { title: "Login | Commonplace" };

export default function LoginPage() {
  return (
    <main id="main-content" className="flex-1 bg-warm px-[18px] py-10 sm:py-16">
      <section className="mx-auto max-w-[558px] sm:rounded-3xl sm:bg-card sm:p-[34px]">
        <div className="mx-auto grid size-[60px] place-items-center rounded-2xl bg-primary text-primary-foreground">
          <Heart className="size-5" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-[clamp(2rem,5vw,2.375rem)] leading-tight sm:text-center">
          Welcome back.
        </h1>
        <p className="mt-3 text-[15px] text-muted-foreground">
          Sign in to join, organize, and track community events.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
