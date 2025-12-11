// components/regions/edit-region-dialog.tsx
"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  regionId: string;
  initialName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export function EditRegionDialog({
  regionId,
  initialName,
  open,
  onOpenChange,
  onUpdated,
}: Props) {
  const supabase = createClient();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  // Update form when initialName changes
  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const submit = async () => {
    if (!name.trim()) {
      toast.error("Region name cannot be empty.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("regions")
      .update({ name })
      .eq("id", regionId);

    setSaving(false);

    if (error) {
      toast.error("Failed to update region.", {
        description: error.message,
      });
      return;
    }

    toast.success("Region updated successfully!");
    onOpenChange(false);
    onUpdated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Region</DialogTitle>
          <DialogDescription>Update the region name below.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Region name"
            aria-label="Region name"
          />

          <div className="flex justify-end">
            <Button onClick={submit} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
