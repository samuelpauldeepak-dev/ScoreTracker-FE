"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"

export function KeyboardShortcuts() {
  const router = useRouter()
  const { isAuthenticated } = useStore()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts if user is authenticated
      if (!isAuthenticated) return

      // Check if Ctrl/Cmd is pressed
      const isCtrlOrCmd = event.ctrlKey || event.metaKey

      if (isCtrlOrCmd) {
        switch (event.key) {
          case "d":
            event.preventDefault()
            router.push("/dashboard")
            break
          case "t":
            event.preventDefault()
            router.push("/tests")
            break
          case "a":
            event.preventDefault()
            router.push("/analytics")
            break
          case "s":
            event.preventDefault()
            router.push("/subjects")
            break
          case "c":
            event.preventDefault()
            router.push("/calendar")
            break
          case "r":
            event.preventDefault()
            router.push("/reports")
            break
          case ",":
            event.preventDefault()
            router.push("/settings")
            break
        }
      }

      // ESC key to close modals (can be extended)
      if (event.key === "Escape") {
        // Close any open modals/dialogs
        const openDialog = document.querySelector('[role="dialog"][data-state="open"]')
        if (openDialog) {
          const closeButton = openDialog.querySelector("[data-dialog-close]")
          if (closeButton) {
            ;(closeButton as HTMLElement).click()
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isAuthenticated, router])

  return null
}
