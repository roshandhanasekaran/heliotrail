"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import {
  PASSPORT_STATUS_LABELS,
  VERIFICATION_STATUS_LABELS,
  MODULE_TECHNOLOGY_LABELS,
} from "@/lib/constants";
import { formatDate } from "@/lib/utils";

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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] max-w-md flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A3A3A3]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by model, serial, or passport ID..."
            className="h-9 w-full border border-[#D9D9D9] bg-white pl-8 pr-3 text-sm placeholder:text-[#A3A3A3] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex h-9 items-center gap-1.5 border border-dashed px-3 text-sm ${
            showFilters || statusFilter
              ? "border-[#22C55E] bg-[#E8FAE9] text-[#0D0D0D]"
              : "border-[#D9D9D9] bg-white text-[#737373] hover:border-[#22C55E] hover:text-[#0D0D0D]"
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
          {statusFilter && (
            <span className="ml-1 inline-flex h-4 w-4 items-center justify-center bg-[#22C55E] text-[9px] font-bold text-white">
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
              onClick={() => setStatusFilter(opt.value)}
              className={`inline-flex items-center px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === opt.value
                  ? "bg-[#0D0D0D] text-white"
                  : "border border-[#D9D9D9] bg-white text-[#737373] hover:border-[#22C55E]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {(search || statusFilter) && (
        <p className="text-xs text-[#737373]">
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
          <p className="text-sm font-medium text-[#737373]">
            No passports match your search
          </p>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            Try a different search term or clear filters.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("");
            }}
            className="cta-secondary mt-4 text-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="clean-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D9D9D9] bg-[#FAFAFA]">
                  <th className="px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-[#737373]">
                    Passport ID
                  </th>
                  <th className="px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-[#737373]">
                    Model
                  </th>
                  <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-[#737373] md:table-cell">
                    Technology
                  </th>
                  <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-[#737373] sm:table-cell">
                    Power
                  </th>
                  <th className="px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-[#737373]">
                    Status
                  </th>
                  <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-[#737373] lg:table-cell">
                    Verification
                  </th>
                  <th className="hidden px-4 py-2.5 text-left text-[0.6875rem] font-bold uppercase tracking-wider text-[#737373] lg:table-cell">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D9D9]">
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="transition-colors hover:bg-[#FAFAFA]"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/app/passports/${p.id}/overview`}
                        className="font-mono text-sm font-medium text-[#0D0D0D] underline-offset-4 hover:underline"
                      >
                        {p.pv_passport_id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#0D0D0D]">
                      {p.model_id}
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-[#737373] md:table-cell">
                      {MODULE_TECHNOLOGY_LABELS[p.module_technology] ??
                        p.module_technology}
                    </td>
                    <td className="hidden px-4 py-3 text-sm font-medium text-[#0D0D0D] sm:table-cell">
                      {p.rated_power_stc_w
                        ? `${p.rated_power_stc_w}W`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold ${
                          p.status === "published"
                            ? "status-valid"
                            : p.status === "under_review"
                              ? "status-pending"
                              : p.status === "draft"
                                ? "bg-[#F2F2F2] text-[#737373]"
                                : p.status === "approved"
                                  ? "status-valid"
                                  : "bg-[#F2F2F2] text-[#737373]"
                        }`}
                      >
                        {PASSPORT_STATUS_LABELS[p.status] ?? p.status}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold ${
                          p.verification_status === "verified"
                            ? "status-valid"
                            : p.verification_status === "pending"
                              ? "status-pending"
                              : "bg-[#F2F2F2] text-[#737373]"
                        }`}
                      >
                        {VERIFICATION_STATUS_LABELS[p.verification_status] ??
                          p.verification_status}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-[#737373] lg:table-cell">
                      {formatDate(p.updated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
