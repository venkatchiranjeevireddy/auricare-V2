import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassmorphismCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassmorphismCard({ children, className }: GlassmorphismCardProps) {
  return (
    <div className={cn(
      "bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl shadow-xl",
      className
    )}>
      {children}
    </div>
  );
}