"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";
import { toast } from "sonner";

interface Props {
  regionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function AddPaymentDialog({
  regionId,
  open,
  onOpenChange,
  onCreated,
}: Props) {
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    payment_method: "",
    payment_type: "",
    min_payin: "",
    max_payin: "",
    min_payout: "",
    max_payout: "",
  });

  // Raw change (only digits and dot)
  const handleMoneyChange = (key: keyof typeof form, value: string) => {
    const cleaned = value.replace(/[^\d.]/g, ""); // allow only numbers and dot
    setForm((prev) => ({ ...prev, [key]: cleaned }));
  };

  // Format number with commas and 2 decimals
  const formatMoney = (value: string) => {
    if (!value) return "";
    const num = Number(value.replace(/,/g, ""));
    return isNaN(num)
      ? ""
      : new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num);
  };

  const handleChange = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from("payment_methods").insert({
      region_id: regionId,
      payment_method: form.payment_method,
      payment_type: form.payment_type,
      min_payin: form.min_payin
        ? Number(form.min_payin.replace(/,/g, ""))
        : null,
      max_payin: form.max_payin
        ? Number(form.max_payin.replace(/,/g, ""))
        : null,
      min_payout: form.min_payout
        ? Number(form.min_payout.replace(/,/g, ""))
        : null,
      max_payout: form.max_payout
        ? Number(form.max_payout.replace(/,/g, ""))
        : null,
    });

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Payment method created!");

    setForm({
      payment_method: "",
      payment_type: "",
      min_payin: "",
      max_payin: "",
      min_payout: "",
      max_payout: "",
    });

    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <form onSubmit={submit} className="grid gap-3">
          <Input
            name="payment_method"
            placeholder="Payment Method"
            required
            value={form.payment_method}
            onChange={(e) => handleChange("payment_method", e.target.value)}
          />

          <Input
            name="payment_type"
            placeholder="Payment Type"
            required
            value={form.payment_type}
            onChange={(e) => handleChange("payment_type", e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              type="text"
              name="min_payin"
              placeholder="Min Payin"
              value={form.min_payin}
              onChange={(e) => handleMoneyChange("min_payin", e.target.value)}
              onBlur={() =>
                setForm((prev) => ({
                  ...prev,
                  min_payin: formatMoney(prev.min_payin),
                }))
              }
            />
            <Input
              type="text"
              name="max_payin"
              placeholder="Max Payin"
              value={form.max_payin}
              onChange={(e) => handleMoneyChange("max_payin", e.target.value)}
              onBlur={() =>
                setForm((prev) => ({
                  ...prev,
                  max_payin: formatMoney(prev.max_payin),
                }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input
              type="text"
              name="min_payout"
              placeholder="Min Payout"
              value={form.min_payout}
              onChange={(e) => handleMoneyChange("min_payout", e.target.value)}
              onBlur={() =>
                setForm((prev) => ({
                  ...prev,
                  min_payout: formatMoney(prev.min_payout),
                }))
              }
            />
            <Input
              type="text"
              name="max_payout"
              placeholder="Max Payout"
              value={form.max_payout}
              onChange={(e) => handleMoneyChange("max_payout", e.target.value)}
              onBlur={() =>
                setForm((prev) => ({
                  ...prev,
                  max_payout: formatMoney(prev.max_payout),
                }))
              }
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
