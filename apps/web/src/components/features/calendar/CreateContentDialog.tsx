import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CreateContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: string | null;
}

export function CreateContentDialog({ open, onOpenChange, selectedDate }: CreateContentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Content</DialogTitle>
          <DialogDescription>
            Create new content for {selectedDate || "the selected date"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Create content dialog would appear here. This is a placeholder for the content creation form.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
