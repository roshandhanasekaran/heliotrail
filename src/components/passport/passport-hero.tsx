import { Badge } from "@/components/ui/badge";
import {
  MODULE_TECHNOLOGY_LABELS,
  VERIFICATION_STATUS_LABELS,
} from "@/lib/constants";
import { formatWatts, formatDate } from "@/lib/utils";
import type { Passport } from "@/types/passport";
import { ShieldCheckIcon, ClockIcon, FactoryIcon } from "lucide-react";

interface PassportHeroProps {
  passport: Passport;
}

export function PassportHero({ passport }: PassportHeroProps) {
  const verificationColor =
    passport.verification_status === "verified"
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";

  return (
    <div className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {MODULE_TECHNOLOGY_LABELS[passport.module_technology] ??
                  passport.module_technology}
              </Badge>
              <Badge className={verificationColor}>
                <ShieldCheckIcon className="mr-1 h-3 w-3" />
                {VERIFICATION_STATUS_LABELS[passport.verification_status]}
              </Badge>
            </div>
            <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight">
              {passport.model_id}
            </h1>
            <p className="mt-1 text-lg text-muted-foreground">
              {formatWatts(passport.rated_power_stc_w)} &middot;{" "}
              {passport.manufacturer_name}
            </p>
          </div>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:text-right">
            <span className="flex items-center gap-1.5 sm:justify-end">
              <FactoryIcon className="h-3.5 w-3.5" />
              {passport.facility_name ?? "—"}
            </span>
            <span className="flex items-center gap-1.5 sm:justify-end">
              <ClockIcon className="h-3.5 w-3.5" />
              Manufactured {formatDate(passport.manufacturing_date)}
            </span>
            <span className="font-mono text-xs">
              {passport.pv_passport_id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
