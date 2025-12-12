"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { UpgradeDialog } from "@/components/upgrade-dialog"

interface SubjectFormData {
  name: string
  icon: string
  color: string
}

interface AddSubjectDialogProps {
  onClose: () => void
}

const predefinedColors = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // yellow
  "#ef4444", // red
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
  "#ec4899", // pink
  "#6b7280", // gray
]

const predefinedIcons = [
  "⚛️",
  "🧪",
  "🧬",
  "📐",
  "📚",
  "🌍",
  "💻",
  "🎨",
  "🎵",
  "⚡",
  "🔬",
  "📊",
  "📖",
  "✏️",
  "🧮",
  "🌟",
  "🎯",
  "🚀",
  "💡",
  "🔥",
]

export function AddSubjectDialog({ onClose }: AddSubjectDialogProps) {
  const { addSubject, canCreateSubject } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0])
  const [selectedIcon, setSelectedIcon] = useState(predefinedIcons[0])
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectFormData>()

  const onSubmit = async (data: SubjectFormData) => {
    if (!canCreateSubject()) {
      setShowUpgradeDialog(true)
      return
    }

    setIsLoading(true)
    try {
      addSubject({
        name: data.name,
        icon: selectedIcon,
        color: selectedColor,
        totalTopics: 0,
        completedTopics: 0,
        averageScore: 0,
        tests: 0,
      })

      toast({
        title: "Subject Added",
        description: `${data.name} has been added successfully.`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add subject. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Subject Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Physics, Chemistry, Mathematics"
            {...register("name", { required: "Subject name is required" })}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-3">
          <Label>Choose Icon</Label>
          <div className="grid grid-cols-10 gap-2">
            {predefinedIcons.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setSelectedIcon(icon)}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg hover:border-primary transition-colors ${
                  selectedIcon === icon ? "border-primary bg-primary/10" : "border-border"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Choose Color</Label>
          <div className="grid grid-cols-10 gap-2">
            {predefinedColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  selectedColor === color ? "border-primary scale-110" : "border-border hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Preview</Label>
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
              style={{ backgroundColor: selectedColor }}
            >
              {selectedIcon}
            </div>
            <div>
              <p className="font-medium">Subject Preview</p>
              <p className="text-sm text-muted-foreground">This is how your subject will appear</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Adding Subject..." : "Add Subject"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>

      <UpgradeDialog
        open={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        reason="You've reached your subject limit. Upgrade to add more subjects and organize your study materials better."
      />
    </>
  )
}
