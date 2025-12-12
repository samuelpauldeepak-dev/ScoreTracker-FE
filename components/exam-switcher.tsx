"use client"

import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { SUBSCRIPTION_PLANS } from "@/lib/constants"

export function ExamSwitcher() {
  const { exams, activeExamId, setActiveExam, addExam, user, canCreateExam } = useAppStore()
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "NEET" as "NEET" | "JEE" | "UPSC" | "SSC" | "Other",
    targetDate: "",
    description: "",
  })
  const { toast } = useToast()

  const activeExam = exams.find((e) => e.id === activeExamId)
  const planId = user?.subscription?.planId || "FREE"
  const plan = SUBSCRIPTION_PLANS[planId]

  const handleAddExam = () => {
    if (!canCreateExam()) {
      toast({
        title: "Upgrade Required",
        description: `You've reached the limit of ${plan.limits.exams} exam(s) on your ${plan.name} plan. Upgrade to add more exams.`,
        variant: "destructive",
      })
      return
    }

    if (!formData.name || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please provide exam name and category.",
        variant: "destructive",
      })
      return
    }

    addExam(formData)
    toast({
      title: "Exam Added",
      description: `${formData.name} has been added successfully.`,
    })
    setFormData({ name: "", category: "NEET", targetDate: "", description: "" })
    setDialogOpen(false)
  }

  if (!user) {
    return (
      <Button variant="outline" className="w-[200px] justify-between bg-transparent" disabled>
        <span>Loading...</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    )
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between bg-transparent"
          >
            <span className="truncate">{activeExam?.name || "Select Exam"}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <DropdownMenuLabel>Your Exams</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {exams.map((exam) => (
            <DropdownMenuItem
              key={exam.id}
              onSelect={() => {
                setActiveExam(exam.id)
                setOpen(false)
                toast({
                  title: "Exam Switched",
                  description: `Now viewing data for ${exam.name}`,
                })
              }}
            >
              <Check className={cn("mr-2 h-4 w-4", activeExamId === exam.id ? "opacity-100" : "opacity-0")} />
              <span className="truncate">{exam.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Exam
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Exam</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Exam Name</Label>
            <Input
              id="name"
              placeholder="e.g., NEET 2025"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value: any) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEET">NEET</SelectItem>
                <SelectItem value="JEE">JEE</SelectItem>
                <SelectItem value="UPSC">UPSC</SelectItem>
                <SelectItem value="SSC">SSC</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date (Optional)</Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Additional details about this exam..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button onClick={handleAddExam} className="w-full">
            Add Exam
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
