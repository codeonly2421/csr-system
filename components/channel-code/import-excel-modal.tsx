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
import { ImportProgressModal } from "./import-progress-modal";

interface Props {
  onImport: (rows: any[]) => Promise<void>;
}

export function ImportExcelModal({ onImport }: Props) {
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [rowsCount, setRowsCount] = useState(0);
  const cancelRef = useRef(false);
  const [progress, setProgress] = useState(0);

  async function handleFile(file: File) {
    cancelRef.current = false;
    setCancelled(false);

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const ws = workbook.Sheets[workbook.SheetNames[0]];

    const rows: any[] = XLSX.utils.sheet_to_json(ws, {
      header: ["channel_codes", "verticals", "geos", "remarks"],
      range: 1, // skip header
      defval: "",
    });

    if (!rows.length) return;

    setRowsCount(rows.length);
    setProcessing(true);
    setProgress(0);

    // Allow cancelling before sending request
    if (cancelRef.current) {
      setCancelled(true);
      setProcessing(false);
      return;
    }

    try {
      await onImport(rows);
      setProgress(100);
      setOpen(false); // close modal after success
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }

  function handleCancel() {
    cancelRef.current = true;
    setProcessing(false);
    setCancelled(true);
    setOpen(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !processing && setOpen(v)}>
        <DialogTrigger asChild>
          <Button variant="outline">Import Excel</Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Excel</DialogTitle>
          </DialogHeader>

          {!processing && !cancelled && (
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Progress Modal */}
      <ImportProgressModal
        open={processing}
        current={progress}
        total={rowsCount}
        footer={
          <Button
            variant="destructive"
            onClick={handleCancel}
            className="w-full"
          >
            Cancel Upload
          </Button>
        }
      />
    </>
  );
}
