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
import type { PaymentMethod } from "@/app/protected/solutions/payports/RegionList";

interface Props {
  entry: PaymentMethod;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export function EditPaymentDialog({
  entry,
  open,
  onOpenChange,
  onUpdated,
}: Props) {
  const supabase = createClient();
  const [form, setForm] = useState<PaymentMethod>(entry);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(entry);
  }, [entry]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = <K extends keyof PaymentMethod>(key: K, value: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setForm((p) => ({ ...(p as any), [key]: value } as PaymentMethod));

  const submit = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("payment_methods")
      .update({
        payment_method: form.payment_method,
        payment_type: form.payment_type,
        min_payin:
          form.min_payin === null || form.min_payin === ""
            ? null
            : Number(form.min_payin),
        max_payin:
          form.max_payin === null || form.max_payin === ""
            ? null
            : Number(form.max_payin),
        min_payout:
          form.min_payout === null || form.min_payout === ""
            ? null
            : Number(form.min_payout),
        max_payout:
          form.max_payout === null || form.max_payout === ""
            ? null
            : Number(form.max_payout),
      })
      .eq("id", form.id);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Payment method updated successfully!");

    onOpenChange(false);
    onUpdated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Payment Method</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="grid gap-3">
          <Input
            name="payment_method"
            value={form.payment_method ?? ""}
            onChange={(e) => handleChange("payment_method", e.target.value)}
          />

          <Input
            name="payment_type"
            value={form.payment_type ?? ""}
            onChange={(e) => handleChange("payment_type", e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              name="min_payin"
              type="number"
              value={form.min_payin ?? ""}
              onChange={(e) =>
                handleChange(
                  "min_payin",
                  e.target.value === "" ? null : e.target.value
                )
              }
            />
            <Input
              name="max_payin"
              type="number"
              value={form.max_payin ?? ""}
              onChange={(e) =>
                handleChange(
                  "max_payin",
                  e.target.value === "" ? null : e.target.value
                )
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input
              name="min_payout"
              type="number"
              value={form.min_payout ?? ""}
              onChange={(e) =>
                handleChange(
                  "min_payout",
                  e.target.value === "" ? null : e.target.value
                )
              }
            />
            <Input
              name="max_payout"
              type="number"
              value={form.max_payout ?? ""}
              onChange={(e) =>
                handleChange(
                  "max_payout",
                  e.target.value === "" ? null : e.target.value
                )
              }
            />
          </div>

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
