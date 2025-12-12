"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"

interface TopicFormData {
  name: string
  difficulty: "easy" | "medium" | "hard"
  progress: number
}

interface AddTopicDialogProps {
  subjectId: string
  onClose: () => void
}

export function AddTopicDialog({ subjectId, onClose }: AddTopicDialogProps) {
  const { addTopic } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState([0])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TopicFormData>({
    defaultValues: {
      progress: 0,
    },
  })

  const onSubmit = async (data: TopicFormData) => {
    setIsLoading(true)
    try {
      addTopic({
        subjectId,
        name: data.name,
        difficulty: data.difficulty,
        progress: progress[0],
      })

      toast({
        title: "Topic Added",
        description: `${data.name} has been added successfully.`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add topic. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "hard":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Topic Name *</Label>
        <Input
          id="name"
          placeholder="e.g., Mechanics, Organic Chemistry, Calculus"
          {...register("name", { required: "Topic name is required" })}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty Level *</Label>
        <Select onValueChange={(value) => setValue("difficulty", value as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">
              <span className="text-green-600">Easy</span>
            </SelectItem>
            <SelectItem value="medium">
              <span className="text-yellow-600">Medium</span>
            </SelectItem>
            <SelectItem value="hard">
              <span className="text-red-600">Hard</span>
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.difficulty && <p className="text-sm text-destructive">{errors.difficulty.message}</p>}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Initial Progress</Label>
          <span className="text-sm font-medium">{progress[0]}%</span>
        </div>
        <Slider value={progress} onValueChange={setProgress} max={100} step={5} className="w-full" />
        <p className="text-xs text-muted-foreground">
          Set the current progress for this topic (0% = not started, 100% = completed)
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Adding Topic..." : "Add Topic"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
