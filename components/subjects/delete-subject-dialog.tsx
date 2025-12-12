"use client"

import { useAppStore } from "@/lib/store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface DeleteSubjectDialogProps {
  subjectId: string | null
  onClose: () => void
}

export function DeleteSubjectDialog({ subjectId, onClose }: DeleteSubjectDialogProps) {
  const { subjects, topics, deleteSubject, deleteTopic } = useAppStore()
  const { toast } = useToast()

  const subject = subjectId ? subjects.find((s) => s.id === subjectId) : null
  const subjectTopics = subjectId ? topics.filter((t) => t.subjectId === subjectId) : []

  const handleDelete = () => {
    if (!subjectId || !subject) return

    // Delete all topics in this subject first
    subjectTopics.forEach((topic) => {
      deleteTopic(topic.id)
    })

    // Then delete the subject
    deleteSubject(subjectId)

    toast({
      title: "Subject Deleted",
      description: `${subject.name} and all its topics have been deleted.`,
    })

    onClose()
  }

  return (
    <AlertDialog open={!!subjectId} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subject</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{subject?.name}"? This will also delete all {subjectTopics.length} topic
            {subjectTopics.length !== 1 ? "s" : ""} in this subject. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Subject
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
