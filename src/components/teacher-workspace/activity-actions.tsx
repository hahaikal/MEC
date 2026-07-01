"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Trash2, CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { deleteActivityRecord, updateActivityRecord } from "@/actions/activities";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ActivityActionsProps {
  activity: any;
  currentUserId: string;
  isAdmin: boolean;
}

export function ActivityActions({ activity, currentUserId, isAdmin }: ActivityActionsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Edit form state
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description || "");
  const [date, setDate] = useState<Date>(new Date(activity.created_at));

  // Only creator or admin can edit/delete
  const canEdit = isAdmin || activity.created_by === currentUserId;

  if (!canEdit) return null;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await deleteActivityRecord(activity.id, activity.class_id, activity.image_url);
      if (!res.success) throw new Error(res.error);
      toast.success("Activity deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete activity");
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEdit = async () => {
    if (!title) {
      toast.error("Title is required");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await updateActivityRecord(activity.id, {
        class_id: activity.class_id,
        title,
        description,
        created_at: date.toISOString(),
      });
      if (!res.success) throw new Error(res.error);
      toast.success("Activity updated successfully");
      setIsEditDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update activity");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-900">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600 focus:text-red-600">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this activity and remove its image from the server. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        if (!open && !isLoading) {
          setIsEditDialogOpen(false);
          // reset state to activity values
          setTitle(activity.title);
          setDescription(activity.description || "");
          setDate(new Date(activity.created_at));
        } else if (open) {
          setIsEditDialogOpen(true);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Activity Title</Label>
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <Label>Activity Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Note: Not allowing image change for simplicity. If they want to change image, they can delete and re-upload. */}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isLoading || !title}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
