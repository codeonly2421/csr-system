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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ConfirmModal } from "@/components/confirm-modal";
import EditModal from "@/components/channel-code/edit-modal";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

export default function DataTable({
  entries,
  loading,
  onDelete,
  onBulkDelete,
  onUpdate,
}: {
  entries: any[];
  loading: boolean;
  onDelete: (id: number) => Promise<void>;
  onBulkDelete: (ids: number[]) => Promise<void>;
  onUpdate: (id: number, data: any) => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  /** SEARCH FILTER */
  const filtered = useMemo(
    () =>
      entries.filter((entry) =>
        `${entry.channel_codes} ${entry.verticals} ${entry.geos} ${entry.remarks}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [entries, search]
  );

  /** SORTING */
  const sorted = useMemo(() => {
    if (!sortColumn) return [...filtered].sort((a, b) => b.id - a.id);
    return [...filtered].sort((a, b) => {
      const valA = a[sortColumn] || "";
      const valB = b[sortColumn] || "";
      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filtered, sortColumn, sortDirection]);

  /** PAGINATION */
  const totalPages = pageSize === -1 ? 1 : Math.ceil(sorted.length / pageSize);
  const paginated =
    pageSize === -1
      ? sorted
      : sorted.slice((page - 1) * pageSize, page * pageSize);

  /** BULK SELECT */
  const toggleSelect = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleSelectAll = () => {
    const currentPageIds = paginated.map((e) => e.id);
    const allSelected = currentPageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  /** BULK DELETE */
  const handleBulkDelete = async () => {
    if (!onBulkDelete) {
      toast.error("Bulk delete handler not provided");
      return;
    }
    try {
      await onBulkDelete(selectedIds);
      toast.success(`${selectedIds.length} entries deleted successfully`);
      setSelectedIds([]);
    } catch (err) {
      toast.error("Bulk delete failed");
    }
  };

  /** SORT TOGGLE */
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
      {/* Top Controls */}
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Input
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

        <div className="flex items-center gap-2">
          <Select
            onValueChange={(v) => {
              setPageSize(Number(v));
              setPage(1);
            }}
            defaultValue="20"
          >
            <SelectTrigger className="w-32">
              Show {pageSize === -1 ? "All" : pageSize}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="-1">All</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash2 /> ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableCaption>Entries</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={
                  paginated.length > 0 &&
                  paginated.every((e) => selectedIds.includes(e.id))
                }
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead
              onClick={() => toggleSort("channel_codes")}
              className="cursor-pointer"
            >
              Channel Codes
            </TableHead>
            <TableHead
              onClick={() => toggleSort("verticals")}
              className="cursor-pointer"
            >
              Verticals
            </TableHead>
            <TableHead
              onClick={() => toggleSort("geos")}
              className="cursor-pointer"
            >
              Geos
            </TableHead>
            <TableHead
              onClick={() => toggleSort("remarks")}
              className="cursor-pointer"
            >
              Remarks
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell colSpan={7}>
                  <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                </TableCell>
              </TableRow>
            ))
          ) : paginated.length ? (
            paginated.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(entry.id)}
                    onCheckedChange={() => toggleSelect(entry.id)}
                  />
                </TableCell>
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
              <TableCell colSpan={7} className="text-center">
                No entries found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
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
