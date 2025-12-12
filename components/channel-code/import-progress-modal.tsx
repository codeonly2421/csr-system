import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import React from "react";

interface ImportProgressModalProps {
  open: boolean;
  current: number;
  total: number;
  footer?: React.ReactNode;
}

export function ImportProgressModal({
  open,
  current,
  total,
  footer,
}: ImportProgressModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="flex flex-col items-center gap-4 py-10 max-w-sm">
        {/* DialogTitle is required for accessibility */}
        <DialogTitle className="sr-only">Import Progress</DialogTitle>

        <Loader2 className="h-10 w-10 animate-spin text-primary" />

        <div className="text-center">
          <p className="font-semibold text-lg">Importing Data...</p>
          <p className="text-sm text-muted-foreground mt-1">
            Saving {current} / {total} rows
          </p>
        </div>

        {footer && <div className="mt-4 w-full">{footer}</div>}
      </DialogContent>
    </Dialog>
  );
}
