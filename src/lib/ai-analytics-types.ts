/**
 * Shared types for the AI Analytics section.
 * Used by the control bar and detail panel components.
 */

export type Persona = "manufacturer" | "operator";
export type TimeRange = "7d" | "30d" | "90d" | "1y";

export interface DetailPanelProps {
  persona: Persona;
  timeRange: TimeRange;
  modelFilter: string;
  onModuleClick: (moduleId: string) => void;
}
