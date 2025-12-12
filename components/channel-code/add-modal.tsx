"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface EntryModalProps {
  triggerText: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => Promise<void>;
}

export default function EntryModal({ triggerText, onSubmit }: EntryModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    channel_codes: "",
    verticals: "",
    geos: "",
    remarks: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);

    await onSubmit(form);

    setLoading(false);

    setOpen(false);
    setForm({
      channel_codes: "",
      verticals: "",
      geos: "",
      remarks: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerText}</Button>
      </DialogTrigger>

      <DialogContent aria-describedby="">
        <DialogHeader>
          <DialogTitle>Add Entry</DialogTitle>
        </DialogHeader>

        {/*  IMPORTANT: Wrap inputs in a form  */}
        <form
          onSubmit={(e) => {
            e.preventDefault(); // stop page refresh
            handleSubmit();
          }}
        >
          <div className="flex flex-col gap-4 mt-4">
            <Input
              name="channel_codes"
              placeholder="Channel Codes"
              value={form.channel_codes}
              onChange={handleChange}
              required
            />

            <Input
              name="verticals"
              placeholder="Verticals"
              value={form.verticals}
              onChange={handleChange}
            />

            <Input
              name="geos"
              placeholder="Geos"
              value={form.geos}
              onChange={handleChange}
            />

            <Textarea
              name="remarks"
              placeholder="Remarks"
              value={form.remarks}
              onChange={handleChange}
              className="min-h-[100px]"
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
