"use client"

import type * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full outline-none transition-all",
        "border border-foreground/25 dark:border-white/30",
        "data-[state=unchecked]:bg-foreground/10 dark:data-[state=unchecked]:bg-white/12",
        // on-state track
        "data-[state=checked]:bg-primary",
        // focus
        "shadow-xs focus-visible:ring-[3px] focus-visible:ring-primary/40 focus-visible:border-primary",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform border",
          "border-foreground/20 dark:border-white/40",
          "data-[state=unchecked]:bg-background dark:data-[state=unchecked]:bg-white data-[state=unchecked]:translate-x-[2px]",
          "data-[state=checked]:bg-primary-foreground data-[state=checked]:translate-x-[calc(100%-2px)]",
          "shadow-sm",
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
