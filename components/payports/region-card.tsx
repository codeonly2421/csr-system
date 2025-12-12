"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddPaymentDialog } from "./add-payment-dialog";
import { EditRegionDialog } from "./edit-region-dialog";
import { EditPaymentDialog } from "./edit-payment-dialog";
import type {
  Region,
  PaymentMethod,
} from "@/app/protected/solutions/payports/limits/RegionList";
import { Trash2, Pencil } from "lucide-react";
import { ConfirmModal } from "@/components/confirm-modal";
import { toast } from "sonner";

interface Props {
  region: Region;
  onChanged: () => void;
}

export function RegionCard({ region, onChanged }: Props) {
  const supabase = createClient();
  const [entries, setEntries] = useState<PaymentMethod[]>(
    region.payment_methods ?? []
  );
  const [addOpen, setAddOpen] = useState(false);
  const [editRegionOpen, setEditRegionOpen] = useState(false);
  const [editPaymentOpen, setEditPaymentOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PaymentMethod | null>(
    null
  );

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("region_id", region.id)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Failed to load payment methods");
      setEntries([]);
    } else {
      setEntries((data as PaymentMethod[]) || []);
    }
  };

  useEffect(() => {
    void fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region.id]);

  const deleteRegion = async () => {
    const { error } = await supabase
      .from("regions")
      .delete()
      .eq("id", region.id);

    if (error) {
      toast.error("Failed to delete region");
      return;
    }

    toast.success("Region deleted");
    onChanged();
  };

  const deletePayment = async (id: string) => {
    const { error } = await supabase
      .from("payment_methods")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete payment method");
      return;
    }

    toast.success("Payment method deleted");
    await fetchPayments();
    onChanged();
  };

  return (
    <Card className="w-full">
      {/* HEADER */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <CardTitle className="font-bold">{region.name}</CardTitle>

        <div className="flex gap-2">
          {/* EDIT REGION BUTTON */}
          <Button
            size="sm"
            variant="default"
            onClick={() => setEditRegionOpen(true)}
            className="flex items-center gap-2"
          >
            <Pencil size={14} />
            Edit Region
          </Button>

          {/* DELETE REGION */}
          <ConfirmModal
            trigger={
              <Button
                size="sm"
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 size={14} />
              </Button>
            }
            title="Delete Region?"
            description="This will delete the region and all associated payment methods."
            confirmText="Delete"
            loadingText="Deleting..."
            variant="destructive"
            onConfirm={deleteRegion}
          />
        </div>
      </CardHeader>

      {/* PAYMENT TABLE */}
      <CardContent className="space-y-4">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No payment methods yet.
          </p>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm border rounded-md overflow-hidden">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">Payment Method</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Min Payin</th>
                  <th className="p-2 text-left">Max Payin</th>
                  <th className="p-2 text-left">Min Payout</th>
                  <th className="p-2 text-left">Max Payout</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {entries.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-2">{row.payment_method}</td>
                    <td className="p-2">{row.payment_type}</td>
                    <td className="p-2">
                      {row.min_payin != null
                        ? new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(row.min_payin))
                        : "-"}
                    </td>
                    <td className="p-2">
                      {row.max_payin != null
                        ? new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(row.max_payin))
                        : "-"}
                    </td>
                    <td className="p-2">
                      {row.min_payout != null
                        ? new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(row.min_payout))
                        : "-"}
                    </td>
                    <td className="p-2">
                      {row.max_payout != null
                        ? new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(row.max_payout))
                        : "-"}
                    </td>

                    <td className="p-2">
                      <div className="flex gap-2 justify-end">
                        {/* EDIT PAYMENT */}
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setSelectedEntry(row);
                            setEditPaymentOpen(true);
                          }}
                        >
                          <Pencil size={14} />
                        </Button>

                        {/* DELETE PAYMENT */}
                        <ConfirmModal
                          trigger={
                            <Button size="icon" variant="destructive">
                              <Trash2 size={14} />
                            </Button>
                          }
                          title="Delete Payment Method?"
                          description="This action cannot be undone."
                          confirmText="Delete"
                          loadingText="Deleting..."
                          variant="destructive"
                          onConfirm={async () => deletePayment(row.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ADD PAYMENT */}
        <Button
          variant="outline"
          onClick={() => setAddOpen(true)}
          className="w-full mt-2"
        >
          Add Payment Method
        </Button>
      </CardContent>

      {/* Dialogs */}
      <AddPaymentDialog
        regionId={region.id}
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreated={async () => {
          await fetchPayments();
          onChanged();
        }}
      />

      <EditRegionDialog
        regionId={region.id}
        initialName={region.name}
        open={editRegionOpen}
        onOpenChange={setEditRegionOpen}
        onUpdated={onChanged}
      />

      {selectedEntry && (
        <EditPaymentDialog
          entry={selectedEntry}
          open={editPaymentOpen}
          onOpenChange={(v) => {
            setEditPaymentOpen(v);
            if (!v) setSelectedEntry(null);
          }}
          onUpdated={async () => {
            await fetchPayments();
            onChanged();
          }}
        />
      )}
    </Card>
  );
}
