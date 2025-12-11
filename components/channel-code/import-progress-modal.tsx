"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface ImportProgressModalProps {
  open: boolean;
  current: number;
  total: number;
}

export function ImportProgressModal({
  open,
  current,
  total,
}: ImportProgressModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="flex flex-col items-center gap-4 py-10 max-w-sm">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />

        <div className="text-center">
          <p className="font-semibold text-lg">Importing Data...</p>
          <p className="text-sm text-muted-foreground mt-1">
            Saving {current} / {total} rows
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
