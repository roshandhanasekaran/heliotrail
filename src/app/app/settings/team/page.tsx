"use client";

import { useState } from "react";
import { Users, UserPlus, Clock, Mail, X } from "lucide-react";
import {
  teamMembers,
  pendingInvites,
  type MockTeamMember,
  type MockInvite,
} from "@/lib/mock/settings";
import { ROLE_LABELS, ROLE_COLORS, type Role } from "@/lib/rbac";
import { formatDate } from "@/lib/utils";

const inputClass =
  "w-full border border-[#D9D9D9] bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E]";
const labelClass =
  "text-xs font-semibold uppercase tracking-wider text-[#737373]";

export default function TeamPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("editor");
  const [invites, setInvites] = useState<MockInvite[]>(pendingInvites);
  const [showBanner, setShowBanner] = useState(false);

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
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 3000);
  }

  function handleRevoke(id: string) {
    setInvites((prev) => prev.filter((inv) => inv.id !== id));
  }

  const inviteRoleOptions: Role[] = ["admin", "compliance", "editor", "viewer"];

  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#0D0D0D]">Team</h2>
        <button
          onClick={() => setShowInvite((v) => !v)}
          className="cta-primary text-xs flex items-center gap-1.5"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Invite Member
        </button>
      </div>

      {/* Success banner */}
      {showBanner && (
        <div className="flex items-center gap-2 rounded-md bg-[#E8FAE9] px-4 py-2.5 text-sm font-medium text-[#15803D]">
          <Mail className="h-4 w-4 shrink-0" />
          Invitation sent successfully
        </div>
      )}

      {/* Invite form */}
      {showInvite && (
        <div className="clean-card border border-[#22C55E]">
          <div className="flex items-center justify-between border-b border-[#D9D9D9] px-5 py-3">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-[#22C55E]" />
              <h3 className="text-sm font-semibold text-[#0D0D0D]">
                Invite Team Member
              </h3>
            </div>
            <button
              onClick={() => setShowInvite(false)}
              className="text-[#737373] hover:text-[#0D0D0D]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  placeholder="colleague@waaree.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as Role)}
                  className={inputClass}
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
        <div className="flex items-center gap-2 border-b border-[#D9D9D9] px-5 py-3">
          <Users className="h-4 w-4 text-[#737373]" />
          <h3 className="text-sm font-semibold text-[#0D0D0D]">Members</h3>
          <span className="ml-auto bg-[#F2F2F2] px-2 py-0.5 text-xs font-semibold text-[#737373]">
            {teamMembers.length}
          </span>
        </div>

        <div className="divide-y divide-[#D9D9D9]">
          {teamMembers.map((member: MockTeamMember) => {
            const colors = ROLE_COLORS[member.role];
            return (
              <div
                key={member.id}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#22C55E] text-sm font-bold text-white">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0D0D0D]">
                      {member.name}
                    </p>
                    <p className="text-xs text-[#737373]">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}
                  >
                    {ROLE_LABELS[member.role]}
                  </span>
                  <span className="text-xs text-[#737373]">
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
          <div className="flex items-center gap-2 border-b border-[#D9D9D9] px-5 py-3">
            <Clock className="h-4 w-4 text-[#F59E0B]" />
            <h3 className="text-sm font-semibold text-[#0D0D0D]">
              Pending Invitations
            </h3>
            <span className="ml-auto bg-[#FEF3C7] px-2 py-0.5 text-xs font-semibold text-[#92400E]">
              {invites.length}
            </span>
          </div>

          <div className="divide-y divide-[#D9D9D9]">
            {invites.map((invite: MockInvite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium text-[#0D0D0D]">
                    {invite.email}
                  </p>
                  <p className="text-xs text-[#737373]">
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
