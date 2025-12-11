"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditModal({
  entry,
  trigger,
  onSave,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entry: any;
  trigger: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (updated: any) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Always clone entry to avoid React state mutation issues
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [form, setForm] = useState<any>({ ...entry });

  const [loading, setLoading] = useState(false);

  // Reset form every time modal re-opens
  useEffect(() => {
    if (open) {
      setForm({ ...entry });
    }
  }, [open, entry]);

  const change = (field: string, value: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setForm((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    await onSave(form);
    setLoading(false);
    setConfirmOpen(false);
    setOpen(false);
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      {/* MAIN EDIT MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Entry</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              name="channel_codes"
              value={form.channel_codes ?? ""}
              onChange={(e) => change("channel_codes", e.target.value)}
              placeholder="Channel Codes"
            />
            <Input
              name="verticals"
              value={form.verticals ?? ""}
              onChange={(e) => change("verticals", e.target.value)}
              placeholder="Verticals"
            />
            <Input
              name="geos"
              value={form.geos ?? ""}
              onChange={(e) => change("geos", e.target.value)}
              placeholder="Geos"
            />
            <Input
              name="remarks"
              value={form.remarks ?? ""}
              onChange={(e) => change("remarks", e.target.value)}
              placeholder="Remarks"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setConfirmOpen(true)} disabled={loading}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM SAVE MODAL */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Save</DialogTitle>
          </DialogHeader>

          <p>Are you sure you want to save these changes?</p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Yes, Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
