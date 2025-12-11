"use client"

import type React from "react"
import { cn } from "@/lib/utils"

type RequireAuthProps = {
  children: React.ReactNode
  className?: string
}

export default function RequireAuth({ children, className }: RequireAuthProps) {
  return <div className={cn("contents", className)}>{children}</div>
}
