import { Input } from "@/components/ui/input";

export default function Field({ label, icon: Icon, name, ...props }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-[13px] font-bold">{label}</label>
      <div className="relative">
        <Icon aria-hidden="true" className="absolute top-1/2 left-4 hidden size-4 -translate-y-1/2 text-muted-foreground sm:block" />
        <Input id={name} name={name} {...props} className="h-[50px] rounded-[10px] border-0 bg-card px-4 sm:bg-hero/60 sm:pl-11" />
      </div>
    </div>
  );
}
