import type { ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className = "" }: LabelProps) {
  return (
    <div className={`h-7 w-[207px] pt-3 ${className}`}>
      <p className="font-[Inter] text-xs font-semibold uppercase leading-4 tracking-[1.2px] text-[#6B7590]">
        {children}
      </p>
    </div>
  );
}
