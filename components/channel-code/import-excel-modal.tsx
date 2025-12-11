"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onImport: (rows: any[]) => Promise<void>;
}

export function ImportExcelModal({ onImport }: Props) {
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const cancelRef = useRef(false); // 🔥 used to cancel upload

  async function handleFile(file: File) {
    cancelRef.current = false;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const ws = workbook.Sheets[workbook.SheetNames[0]];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: any[] = XLSX.utils.sheet_to_json(ws, {
      header: ["channel_codes", "verticals", "geos", "remarks"],
      range: 1, // 🔥 skip header row
      defval: "",
    });

    setProcessing(true);

    const total = rows.length;
    let processed = 0;

    for (const row of rows) {
      if (cancelRef.current) {
        console.warn("Upload cancelled by user");
        break;
      }

      await onImport([row]); // process 1 row at a time

      processed++;
      setProgress(Math.round((processed / total) * 100));
    }

    setProcessing(false);

    if (!cancelRef.current) {
      setOpen(false); // close only if not cancelled
    }
  }

  function handleCancel() {
    cancelRef.current = true;
    setProcessing(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !processing && setOpen(v)}>
      <DialogTrigger asChild>
        <Button variant="outline">Import Excel</Button>
      </DialogTrigger>

      <DialogContent aria-describedby="" className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import Excel</DialogTitle>
        </DialogHeader>

        {!processing && (
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        )}

        {processing && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Uploading data… Please wait.
            </p>

            <Progress value={progress} />
            <p className="text-sm text-center">{progress}%</p>

            <Button
              variant="destructive"
              onClick={handleCancel}
              className="w-full"
            >
              Cancel Upload
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
