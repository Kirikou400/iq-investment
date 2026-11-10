import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <div className="mb-2 text-[10px] font-black uppercase tracking-[.2em] text-amber-400">
            {eyebrow}
          </div>
        )}
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-[32px]">{title}</h1>
        {description && <p className="mt-2 text-sm text-slate-300 max-w-2xl">{description}</p>}
      </div>
      {action}
    </div>
  );
}
