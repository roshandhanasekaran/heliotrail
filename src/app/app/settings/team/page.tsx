"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { Users, UserPlus, Clock, X } from "lucide-react";
import {
  teamMembers,
  pendingInvites,
  currentUser,
  type MockTeamMember,
  type MockInvite,
} from "@/lib/mock/settings";
import { ROLE_LABELS, ROLE_COLORS, canDo, type Role } from "@/lib/rbac";
import { formatDate } from "@/lib/utils";
import { LABEL_CLASS, INPUT_CLASS } from "@/lib/styles";

export default function TeamPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("editor");
  const [invites, setInvites] = useState<MockInvite[]>(pendingInvites);
  function handleSendInvitation() {
    if (!inviteEmail.trim()) return;

    const newInvite: MockInvite = {
      id: `inv_${Date.now()}`,
      email: inviteEmail.trim(),
      role: inviteRole,
      invitedBy: "Roshan Dhanasekaran",
      invitedAt: new Date().toISOString(),
    };

    setInvites((prev) => [...prev, newInvite]);
    setInviteEmail("");
    setInviteRole("editor");
    setShowInvite(false);
    toast.success("Invitation sent", { description: `Invite sent to ${newInvite.email} as ${newInvite.role}.` });
  }

  function handleRevoke(id: string) {
    setInvites((prev) => prev.filter((inv) => inv.id !== id));
  }

  const inviteRoleOptions: Role[] = ["admin", "compliance", "editor", "viewer"];

  if (!canDo(currentUser.role, "team.view")) {
    redirect("/app/settings/profile");
  }

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Team</h2>
        <button
          onClick={() => setShowInvite((v) => !v)}
          className="cta-primary text-xs flex items-center gap-1.5"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Invite Member
        </button>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="clean-card border border-primary">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Invite Team Member
              </h3>
            </div>
            <button
              onClick={() => setShowInvite(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={LABEL_CLASS}>Email Address</label>
                <input
                  type="email"
                  placeholder="colleague@waaree.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>

              <div className="space-y-1.5">
                <label className={LABEL_CLASS}>Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as Role)}
                  className={INPUT_CLASS}
                >
                  {inviteRoleOptions.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleSendInvitation}
                disabled={!inviteEmail.trim()}
                className="cta-primary text-xs disabled:opacity-50"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members card */}
      <div className="clean-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Members</h3>
          <span className="ml-auto bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            {teamMembers.length}
          </span>
        </div>

        <div className="divide-y divide-border">
          {teamMembers.map((member: MockTeamMember) => {
            const colors = ROLE_COLORS[member.role];
            return (
              <div
                key={member.id}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}
                  >
                    {ROLE_LABELS[member.role]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Active {formatDate(member.lastActive)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Invites card */}
      {invites.length > 0 && (
        <div className="clean-card">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <Clock className="h-4 w-4 text-[#F59E0B]" />
            <h3 className="text-sm font-semibold text-foreground">
              Pending Invitations
            </h3>
            <span className="ml-auto bg-[var(--passport-amber-muted)] px-2 py-0.5 text-xs font-semibold text-[#92400E]">
              {invites.length}
            </span>
          </div>

          <div className="divide-y divide-border">
            {invites.map((invite: MockInvite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {invite.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Invited as {ROLE_LABELS[invite.role]} by {invite.invitedBy}{" "}
                    · {formatDate(invite.invitedAt)}
                  </p>
                </div>
                <button
                  onClick={() => handleRevoke(invite.id)}
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
