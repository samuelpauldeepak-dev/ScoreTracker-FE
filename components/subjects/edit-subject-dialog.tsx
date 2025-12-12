"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface SubjectFormData {
  name: string
  icon: string
  color: string
}

interface EditSubjectDialogProps {
  subjectId: string
  onClose: () => void
}

const predefinedColors = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#84cc16",
  "#ec4899",
  "#6b7280",
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

export function EditSubjectDialog({ subjectId, onClose }: EditSubjectDialogProps) {
  const { subjects, updateSubject } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("")

  const subject = subjects.find((s) => s.id === subjectId)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SubjectFormData>()

  useEffect(() => {
    if (subject) {
      setValue("name", subject.name)
      setSelectedColor(subject.color)
      setSelectedIcon(subject.icon)
    }
  }, [subject, setValue])

  const onSubmit = async (data: SubjectFormData) => {
    setIsLoading(true)
    try {
      updateSubject(subjectId, {
        name: data.name,
        icon: selectedIcon,
        color: selectedColor,
      })

      toast({
        title: "Subject Updated",
        description: `${data.name} has been updated successfully.`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subject. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!subject) return null

  return (
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
          {isLoading ? "Updating Subject..." : "Update Subject"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
