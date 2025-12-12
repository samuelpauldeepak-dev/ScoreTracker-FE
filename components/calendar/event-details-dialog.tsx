"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { format } from "date-fns"
import { MoreHorizontal, Edit, Trash2, Calendar, Clock, BookOpen, FileText } from "lucide-react"

interface EventDetailsDialogProps {
  eventId: string
  onClose: () => void
}

export function EventDetailsDialog({ eventId, onClose }: EventDetailsDialogProps) {
  const { calendarEvents, deleteCalendarEvent } = useAppStore()
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const event = calendarEvents.find((e) => e.id === eventId)

  if (!event) return null

  const handleDelete = () => {
    deleteCalendarEvent(eventId)
    toast({
      title: "Event Deleted",
      description: `${event.title} has been removed from your calendar.`,
    })
    setShowDeleteDialog(false)
    onClose()
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "test":
        return "bg-red-100 text-red-700 hover:bg-red-100"
      case "study":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100"
      case "revision":
        return "bg-green-100 text-green-700 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100"
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "test":
        return <FileText className="h-4 w-4" />
      case "study":
        return <BookOpen className="h-4 w-4" />
      case "revision":
        return <BookOpen className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-bold">{event.title}</h2>
          <Badge className={getEventTypeColor(event.type)} variant="secondary">
            <span className="flex items-center gap-1">
              {getEventTypeIcon(event.type)}
              {event.type}
            </span>
          </Badge>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Event
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4" />
              Delete Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Event Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
        </div>

        {event.time && (
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{event.time}</span>
          </div>
        )}

        {event.subject && (
          <div className="flex items-center gap-3">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>{event.subject}</span>
          </div>
        )}

        {event.description && (
          <div className="space-y-2">
            <h4 className="font-medium">Description</h4>
            <p className="text-muted-foreground">{event.description}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" className="flex-1 bg-transparent">
          Edit Event
        </Button>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{event.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
