import { cn } from "@/lib/utils"
import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "informativo" | "novedad" | "urgente"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white",
        variant === "urgente" && "bg-red-600",
        variant === "novedad" && "bg-blue-600",
        variant === "informativo" && "bg-gray-600",
        variant === "default" && "bg-gray-400",
        className
      )}
      {...props}
    />
  )
}
