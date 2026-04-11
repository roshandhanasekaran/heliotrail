"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import {
  MODULE_TECHNOLOGY_LABELS,
} from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";

interface PassportRow {
  id: string;
  pv_passport_id: string;
  model_id: string;
  module_technology: string;
  rated_power_stc_w: number | null;
  status: string;
  verification_status: string;
  updated_at: string;
  serial_number: string | null;
  manufacturer_name: string;
}

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "published", label: "Published" },
  { value: "approved", label: "Approved" },
  { value: "under_review", label: "Under Review" },
  { value: "draft", label: "Draft" },
];

export function PassportListClient({
  passports,
}: {
  passports: PassportRow[];
}) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = passports;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.pv_passport_id.toLowerCase().includes(q) ||
          p.model_id.toLowerCase().includes(q) ||
          (p.serial_number && p.serial_number.toLowerCase().includes(q)) ||
          p.manufacturer_name.toLowerCase().includes(q)
      );
    }

    if (statusFilter) {
      result = result.filter((p) => p.status === statusFilter);
    }

    return result;
  }, [passports, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(startIdx, startIdx + PAGE_SIZE);
  const displayStart = filtered.length === 0 ? 0 : startIdx + 1;
  const displayEnd = Math.min(startIdx + PAGE_SIZE, filtered.length);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleStatusFilter(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  // Build visible page numbers: show up to 5 around current page
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [];
    pages.push(1);
    if (safePage > 3) pages.push("…");
    for (let p = Math.max(2, safePage - 1); p <= Math.min(totalPages - 1, safePage + 1); p++) {
      pages.push(p);
    }
    if (safePage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  }, [totalPages, safePage]);

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] max-w-md flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by model, serial, or passport ID..."
            className="h-9 w-full border border-border bg-card pl-8 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex h-9 items-center gap-1.5 border border-dashed px-3 text-sm ${
            showFilters || statusFilter
              ? "border-primary bg-[var(--passport-green-muted)] text-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
          {statusFilter && (
            <span className="ml-1 inline-flex h-4 w-4 items-center justify-center bg-primary text-[9px] font-bold text-white">
              1
            </span>
          )}
        </button>
      </div>

      {/* Filter dropdown */}
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatusFilter(opt.value)}
              className={`inline-flex items-center px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === opt.value
                  ? "bg-foreground text-background"
                  : "border border-border bg-card text-muted-foreground hover:border-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {(search || statusFilter) && (
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {passports.length} passports
          {search && <span> matching &ldquo;{search}&rdquo;</span>}
          {statusFilter && (
            <span>
              {" "}
              &middot; {STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label}
            </span>
          )}
        </p>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="dashed-card flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            No passports match your search
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Try a different search term or clear filters.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("");
              setPage(1);
            }}
            className="cta-secondary mt-4 text-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="clean-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">
                      Passport ID
                    </th>
                    <th className="px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">
                      Model
                    </th>
                    <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground md:table-cell">
                      Technology
                    </th>
                    <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground sm:table-cell">
                      Power
                    </th>
                    <th className="px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground lg:table-cell">
                      Verification
                    </th>
                    <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground lg:table-cell">
                      Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginated.map((p) => (
                    <tr
                      key={p.id}
                      className="transition-colors hover:bg-muted/50"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/app/passports/${p.id}/overview`}
                          className="font-mono text-sm font-medium text-foreground underline-offset-4 hover:underline"
                        >
                          {p.pv_passport_id}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {p.model_id}
                      </td>
                      <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                        {MODULE_TECHNOLOGY_LABELS[p.module_technology] ??
                          p.module_technology}
                      </td>
                      <td className="hidden px-4 py-3 text-sm font-medium text-foreground sm:table-cell">
                        {p.rated_power_stc_w
                          ? `${p.rated_power_stc_w}W`
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <StatusBadge status={p.verification_status} />
                      </td>
                      <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">
                        {formatDate(p.updated_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              Showing {displayStart}–{displayEnd} of {filtered.length} passport{filtered.length !== 1 ? "s" : ""}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="inline-flex h-8 w-8 items-center justify-center border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                {pageNumbers.map((p, i) =>
                  p === "…" ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="inline-flex h-8 w-8 items-center justify-center text-xs text-muted-foreground"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`inline-flex h-8 w-8 items-center justify-center text-xs font-medium transition-colors ${
                        p === safePage
                          ? "bg-foreground text-background"
                          : "border border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
