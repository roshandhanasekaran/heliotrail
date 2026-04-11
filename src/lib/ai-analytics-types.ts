/**
 * Shared types for the AI Analytics section.
 * Used by the control bar and detail panel components.
 */

export type Persona = "manufacturer" | "operator";
export type TimeRange = "7d" | "30d" | "90d" | "1y";

export interface FleetOption {
  id: string;
  name: string;
  city: string;
  country: string;
  climate: string;
  moduleCount: number;
}

export interface DetailPanelProps {
  persona: Persona;
  timeRange: TimeRange;
  fleetId: string | null;
  onModuleClick: (moduleId: string) => void;
}
