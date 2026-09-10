import type { ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className = "" }: LabelProps) {
  return (
    <div className={`w-[207px] h-7 pt-3 ${className}`}>
      <p className="font-inter text-xs font-semibold uppercase leading-4 tracking-[1.2px] text-[#6B7590]">
        {children}
      </p>
    </div>
  );
}
