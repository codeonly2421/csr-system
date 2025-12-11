// // app/protected/payports/RegionList.tsx
// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import { createClient } from "@/lib/supabase/client";
// import { Button } from "@/components/ui/button";
// import { AddRegionDialog } from "@/components/payports/add-region-dialog";
// import { RegionCard } from "@/components/payports/region-card";
// import { Plus } from "lucide-react";

// export type Region = {
//   id: string;
//   name: string;
//   created_at: string;
//   payment_methods?: PaymentMethod[];
// };

// export type PaymentMethod = {
//   id: string;
//   region_id: string;
//   payment_method: string;
//   payment_type: string;
//   min_payin: string | number | null;
//   max_payin: string | number | null;
//   min_payout: string | number | null;
//   max_payout: string | number | null;
//   created_at: string;
// };

// export default function RegionList() {
//   const supabase = createClient();
//   const [regions, setRegions] = useState<Region[]>([]);
//   const [openAddRegion, setOpenAddRegion] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const fetchRegions = useCallback(async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from("regions")
//       .select("id, name, created_at, payment_methods(*)")
//       .order("created_at", { ascending: true });

//     if (error) {
//       console.error("fetchRegions error", error);
//       setRegions([]);
//     } else {
//       setRegions((data as Region[]) || []);
//     }
//     setLoading(false);
//   }, [supabase]);

//   useEffect(() => {
//     fetchRegions();
//   }, [fetchRegions]);

//   // Shared refresh that child components call
//   const refresh = useCallback(() => {
//     void fetchRegions();
//   }, [fetchRegions]);

//   return (
//     <div className="space-y-4">
//       <div>
//         <Button
//           size="sm"
//           variant="default"
//           onClick={() => setOpenAddRegion(true)}
//           className="flex items-center gap-2"
//         >
//           <Plus size={14} />
//           Add Region
//         </Button>
//       </div>

//       <AddRegionDialog
//         open={openAddRegion}
//         onOpenChange={setOpenAddRegion}
//         onCreated={refresh}
//       />

//       {loading ? (
//         <p className="text-sm text-muted-foreground">Loading regions...</p>
//       ) : regions.length === 0 ? (
//         <p className="text-sm text-muted-foreground">No regions yet.</p>
//       ) : (
//         <div className="space-y-4">
//           {regions.map((r) => (
//             <RegionCard key={r.id} region={r} onChanged={refresh} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { AddRegionDialog } from "@/components/payports/add-region-dialog";
import { RegionCard } from "@/components/payports/region-card";
import { Plus } from "lucide-react";

export type Region = {
  id: string;
  name: string;
  created_at: string;
  payment_methods?: PaymentMethod[];
};

export type PaymentMethod = {
  id: string;
  region_id: string;
  payment_method: string;
  payment_type: string;
  min_payin: string | number | null;
  max_payin: string | number | null;
  min_payout: string | number | null;
  max_payout: string | number | null;
  created_at: string;
};

export default function RegionList() {
  const supabase = createClient();
  const [regions, setRegions] = useState<Region[]>([]);
  const [openAddRegion, setOpenAddRegion] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRegions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("regions")
      .select("id, name, created_at, payment_methods(*)")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("fetchRegions error", error);
      setRegions([]);
    } else {
      setRegions((data as Region[]) || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchRegions();
  }, [fetchRegions]);

  // Shared refresh that child components call
  const refresh = useCallback(() => {
    void fetchRegions();
  }, [fetchRegions]);

  return (
    <div className="space-y-4">
      <div>
        <Button
          size="sm"
          variant="default"
          onClick={() => setOpenAddRegion(true)}
          className="flex items-center gap-2"
        >
          <Plus size={14} />
          Add Region
        </Button>
      </div>

      <AddRegionDialog
        open={openAddRegion}
        onOpenChange={setOpenAddRegion}
        onCreated={refresh}
      />

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="w-full border rounded-md p-4 bg-white shadow-sm animate-pulse"
            >
              {/* Header skeleton */}
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 w-48 bg-gray-200 rounded"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-gray-200 rounded"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Table skeleton */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      {Array.from({ length: 7 }).map((_, thIdx) => (
                        <th key={thIdx} className="p-2">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 3 }).map((_, rowIdx) => (
                      <tr key={rowIdx}>
                        {Array.from({ length: 7 }).map((_, cellIdx) => (
                          <td key={cellIdx} className="p-2">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Payment button skeleton */}
              <div className="mt-4 h-8 w-36 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : regions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No regions yet.</p>
      ) : (
        <div className="space-y-4">
          {regions.map((r) => (
            <RegionCard key={r.id} region={r} onChanged={refresh} />
          ))}
        </div>
      )}
    </div>
  );
}
