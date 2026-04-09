import { createClient } from "@/lib/supabase/server";
import {
  PASSPORT_STATUS_LABELS,
  VERIFICATION_STATUS_LABELS,
  MODULE_TECHNOLOGY_LABELS,
} from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";

export default async function PassportsListPage() {
  const supabase = await createClient();
  const { data: passports } = await supabase
    .from("passports")
    .select("*")
    .order("updated_at", { ascending: false });

  const all = passports ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D0D0D]">Passports</h1>
          <p className="mt-1 text-sm text-[#737373]">
            {all.length} passport{all.length !== 1 ? "s" : ""} in your portfolio
          </p>
        </div>
        <Link href="/app/passports/new" className="cta-primary text-sm">
          <Plus className="h-4 w-4" />
          Create Passport
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A3A3A3]" />
          <input
            type="text"
            placeholder="Search by model, serial, or passport ID..."
            className="h-9 w-full border border-[#D9D9D9] bg-white pl-8 pr-3 text-sm placeholder:text-[#A3A3A3] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]"
          />
        </div>
        <button className="inline-flex h-9 items-center gap-1.5 border border-dashed border-[#D9D9D9] bg-white px-3 text-sm text-[#737373] hover:border-[#22C55E] hover:text-[#0D0D0D]">
          <Filter className="h-3.5 w-3.5" />
          Filters
        </button>
      </div>

      {/* Table */}
      {all.length === 0 ? (
        <div className="dashed-card flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-[#737373]">
            No passports yet
          </p>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            Create your first digital product passport to get started.
          </p>
          <Link href="/app/passports/new" className="cta-primary mt-4 text-xs">
            Create Passport
          </Link>
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
                {all.map((p) => (
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
                      {MODULE_TECHNOLOGY_LABELS[p.module_technology] ?? p.module_technology}
                    </td>
                    <td className="hidden px-4 py-3 text-sm font-medium text-[#0D0D0D] sm:table-cell">
                      {p.rated_power_stc_w ? `${p.rated_power_stc_w}W` : "—"}
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
                        {VERIFICATION_STATUS_LABELS[p.verification_status] ?? p.verification_status}
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
    </div>
  );
}
