"use client";

import EntryModal from "@/components/channel-code/add-modal";
import DataTable from "@/components/channel-code/DataTable";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { ImportExcelModal } from "@/components/channel-code/import-excel-modal";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ChannelPage() {
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("entries")
      .select("*")
      .order("id", { ascending: true });

    setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreate = async (form: any) => {
    const t = toast.loading("Creating entry...");

    const { error } = await supabase.from("entries").insert([form]);

    if (error) {
      toast.error("Failed to create entry", { id: t });
      return;
    }

    toast.success("Entry added successfully!", { id: t });
    await fetchEntries();
  };

  const handleDelete = async (id: number) => {
    const t = toast.loading("Deleting entry...");

    const { error } = await supabase.from("entries").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete entry", { id: t });
      return;
    }

    toast.success("Entry deleted!", { id: t });
    await fetchEntries();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = async (id: number, data: any) => {
    const t = toast.loading("Updating entry...");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, created_at, updated_at, ...safeData } = data;

    const { error } = await supabase
      .from("entries")
      .update(safeData)
      .eq("id", id);

    if (error) {
      toast.error("Failed to update entry", { id: t });
      return;
    }

    toast.success("Entry updated!", { id: t });
    await fetchEntries();
  };

  return (
    <div className="py-10 max-w-5xl mx-auto w-full px-4">
      {/* Go Back Button */}
      <div className="flex justify-start mb-6">
        <Link href="/protected">
          <Button variant="outline">Go Back</Button>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <EntryModal triggerText="Add Data" onSubmit={handleCreate} />

        <ImportExcelModal
          onImport={async (rows) => {
            for (const row of rows) {
              await handleCreate({
                channel_codes: row.channel_codes ?? "",
                verticals: row.verticals ?? "",
                geos: row.geos ?? "",
                remarks: row.remarks ?? "",
              });
            }
          }}
        />
      </div>

      <DataTable
        entries={entries}
        loading={loading}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
