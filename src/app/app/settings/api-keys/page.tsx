"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { Key, Plus, Copy, Check, Trash2 } from "lucide-react";
import { apiKeys as initialKeys, currentUser, type MockApiKey } from "@/lib/mock/settings";
import { canDo } from "@/lib/rbac";
import { formatDate } from "@/lib/utils";
import { LABEL_CLASS, INPUT_CLASS } from "@/lib/styles";

function randomPrefix(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `ht_live_${suffix}`;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<MockApiKey[]>(initialKeys);
  const [showForm, setShowForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCreate() {
    if (!newKeyName.trim()) return;
    const newKey: MockApiKey = {
      id: `key_new_${Date.now()}`,
      name: newKeyName.trim(),
      prefix: randomPrefix(),
      scopes: ["passports:read"],
      createdAt: new Date().toISOString(),
      lastUsed: null,
    };
    setKeys((prev) => [newKey, ...prev]);
    setNewKeyName("");
    setShowForm(false);
  }

  function handleRevoke(id: string) {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  }

  function handleCopy(id: string, prefix: string) {
    navigator.clipboard.writeText(prefix + "••••••••••••••••").catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (!canDo(currentUser.role, "api-keys.manage")) {
    redirect("/app/settings/profile");
  }

  return (
    <div className="space-y-5">
      {/* Page heading + create button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">API Keys</h2>
          <p className="text-sm text-muted-foreground">
            Manage API keys used by integrations and external systems.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="cta-primary text-xs flex items-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Key
        </button>
      </div>

      {/* Create key form */}
      {showForm && (
        <div className="clean-card border border-primary">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <Key className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              New API Key
            </h3>
          </div>
          <div className="p-5">
            <div className="max-w-sm space-y-4">
              <div className="space-y-1.5">
                <label className={LABEL_CLASS}>Key Name</label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. ERP Integration"
                  className={INPUT_CLASS}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCreate}
                  disabled={!newKeyName.trim()}
                  className="cta-primary text-xs disabled:opacity-40"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setNewKeyName("");
                  }}
                  className="cta-secondary text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active keys card */}
      <div className="clean-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Key className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Active Keys</h3>
          <span className="ml-auto rounded bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            {keys.length}
          </span>
        </div>

        {keys.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground/70">
            No active API keys. Create one above.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {keys.map((key) => {
              const isCopied = copiedId === key.id;
              return (
                <div
                  key={key.id}
                  className="flex items-start gap-3 px-5 py-3"
                >
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {key.name}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                        {key.prefix}••••
                      </code>
                      <span>·</span>
                      <span>Created {formatDate(key.createdAt)}</span>
                      <span>·</span>
                      <span>
                        {key.lastUsed
                          ? `Last used ${formatDate(key.lastUsed)}`
                          : "Never used"}
                      </span>
                    </p>
                    {/* Scope tags */}
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {key.scopes.map((scope) => (
                        <span
                          key={scope}
                          className="rounded bg-[var(--passport-green-muted)] px-1.5 py-0.5 text-[0.625rem] font-medium text-primary"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => handleCopy(key.id, key.prefix)}
                      title="Copy key prefix"
                      className="flex h-7 w-7 items-center justify-center rounded border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {isCopied ? (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleRevoke(key.id)}
                      title="Revoke key"
                      className="flex h-7 w-7 items-center justify-center rounded border border-border bg-card text-muted-foreground transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
