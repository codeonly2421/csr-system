// components/regions/add-region-dialog.tsx
"use client";

import React, { useState } from "react";
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function AddRegionDialog({ open, onOpenChange, onCreated }: Props) {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!name.trim()) {
      toast.error("Region name cannot be empty.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("regions").insert({ name });

    setSaving(false);

    if (error) {
      toast.error("Failed to create region.", {
        description: error.message,
      });
      return;
    }

    toast.success("Region created.");
    setName("");
    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Region</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            name="region_name"
            placeholder="Region name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
