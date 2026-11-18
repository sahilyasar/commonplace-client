import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function CreateEventButton({ className }) {
  return (
    <Link href="/add-form" className={buttonVariants({ variant: "outline", className })}>
      Create an event <ArrowRight aria-hidden="true" />
    </Link>
  );
}
