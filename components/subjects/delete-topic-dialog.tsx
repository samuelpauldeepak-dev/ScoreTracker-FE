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

interface DeleteTopicDialogProps {
  topicId: string | null
  onClose: () => void
}

export function DeleteTopicDialog({ topicId, onClose }: DeleteTopicDialogProps) {
  const { topics, deleteTopic } = useAppStore()
  const { toast } = useToast()

  const topic = topicId ? topics.find((t) => t.id === topicId) : null

  const handleDelete = () => {
    if (!topicId || !topic) return

    deleteTopic(topicId)

    toast({
      title: "Topic Deleted",
      description: `${topic.name} has been deleted.`,
    })

    onClose()
  }

  return (
    <AlertDialog open={!!topicId} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Topic</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{topic?.name}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Topic
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
