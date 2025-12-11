"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/confirm-modal";
import EditModal from "@/components/channel-code/edit-modal";
import { Trash2, Pencil } from "lucide-react";

export default function DataTable({
  entries,
  loading,
  onDelete,
  onUpdate,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entries: any[];
  loading: boolean;
  onDelete: (id: number) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate: (id: number, data: any) => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const pageSize = 20;

  /** ------------------------------
   *  SEARCH FILTER
   * ------------------------------ */
  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      const text =
        `${entry.channel_codes} ${entry.verticals} ${entry.geos} ${entry.remarks}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [entries, search]);

  /** ------------------------------
   *  SORTING
   * ------------------------------ */
  const sorted = useMemo(() => {
    if (!sortColumn) return filtered;

    return [...filtered].sort((a, b) => {
      const valA = a[sortColumn] || "";
      const valB = b[sortColumn] || "";

      if (sortDirection === "asc") {
        return String(valA).localeCompare(String(valB));
      } else {
        return String(valB).localeCompare(String(valA));
      }
    });
  }, [filtered, sortColumn, sortDirection]);

  /** ------------------------------
   *  PAGINATION
   * ------------------------------ */
  const totalPages = Math.ceil(sorted.length / pageSize);

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="w-full space-y-4">
      {/*search */}
      <div className="flex  items-center gap-2">
        <Input
          name="search_entries"
          placeholder="Search entries..."
          className="w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {search && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
          >
            Clear
          </Button>
        )}
      </div>

      <Table>
        <TableCaption>Entries</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => toggleSort("channel_codes")}
              className="cursor-pointer"
            >
              Channel Codes{" "}
              {sortColumn === "channel_codes" &&
                (sortDirection === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead
              onClick={() => toggleSort("verticals")}
              className="cursor-pointer"
            >
              Verticals{" "}
              {sortColumn === "verticals" &&
                (sortDirection === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead
              onClick={() => toggleSort("geos")}
              className="cursor-pointer"
            >
              Geos{" "}
              {sortColumn === "geos" && (sortDirection === "asc" ? "▲" : "▼")}
            </TableHead>
            <TableHead
              onClick={() => toggleSort("remarks")}
              className="cursor-pointer"
            >
              Remarks{" "}
              {sortColumn === "remarks" &&
                (sortDirection === "asc" ? "▲" : "▼")}
            </TableHead>

            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        {/* 
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : paginated.length ? (
            paginated.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.channel_codes}</TableCell>
                <TableCell>{entry.verticals}</TableCell>
                <TableCell>{entry.geos}</TableCell>
                <TableCell>{entry.remarks}</TableCell>

                <TableCell className="flex justify-end gap-2">
                  <EditModal
                    entry={entry}
                    trigger={
                      <Button size="sm" variant="outline">
                        <Pencil size={14} />
                      </Button>
                    }
                    onSave={(updated) => onUpdate(entry.id, updated)}
                  />

                  <ConfirmModal
                    trigger={
                      <Button size="sm" variant="destructive">
                        <Trash2 size={14} />
                      </Button>
                    }
                    onConfirm={() => onDelete(entry.id)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No entries found.
              </TableCell>
            </TableRow>
          )}
        </TableBody> */}

        <TableBody>
          {loading ? (
            // Skeleton rows
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div className="h-7 w-32 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-7 w-24 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-7 w-20 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-7 w-48 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-7 w-48 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-7 w-48 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-7 w-24 bg-gray-200 rounded animate-pulse ml-auto"></div>
                </TableCell>
              </TableRow>
            ))
          ) : paginated.length ? (
            paginated.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.channel_codes}</TableCell>
                <TableCell>{entry.verticals}</TableCell>
                <TableCell>{entry.geos}</TableCell>
                <TableCell>{entry.remarks}</TableCell>

                <TableCell className="flex justify-end gap-2">
                  <EditModal
                    entry={entry}
                    trigger={
                      <Button size="sm" variant="outline">
                        <Pencil size={14} />
                      </Button>
                    }
                    onSave={(updated) => onUpdate(entry.id, updated)}
                  />

                  <ConfirmModal
                    trigger={
                      <Button size="sm" variant="destructive">
                        <Trash2 size={14} />
                      </Button>
                    }
                    onConfirm={() => onDelete(entry.id)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No entries found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center pt-3">
        <div className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>

          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
