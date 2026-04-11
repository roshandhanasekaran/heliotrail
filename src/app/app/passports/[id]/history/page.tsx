import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { History, GitBranch } from "lucide-react";

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: p } = await supabase
    .from("passports")
    .select("*")
    .eq("id", id)
    .single();

  if (!p) notFound();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">History</h2>

      {/* Current version info */}
      <div className="clean-card p-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <GitBranch className="h-3.5 w-3.5" />
          Current Version
        </div>
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Version</span>
            <span className="font-mono font-semibold text-foreground">
              v{p.passport_version}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Created</span>
            <span className="text-foreground">{formatDate(p.created_at)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Updated</span>
            <span className="text-foreground">{formatDate(p.updated_at)}</span>
          </div>
          {p.published_at && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Published</span>
              <span className="text-primary">
                {formatDate(p.published_at)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Audit trail placeholder */}
      <div className="dashed-card flex flex-col items-center py-12 text-center">
        <History className="h-8 w-8 text-border" />
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          Detailed audit trail coming soon
        </p>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground/70">
          Version comparison, field-level diffs, approver comments, and
          publish/reject records will appear here.
        </p>
      </div>
    </div>
  );
}
