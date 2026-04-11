"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPassport } from "@/app/actions/passport";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Send,
  Tag,
  Cpu,
  Layers,
  ShieldCheck,
  Recycle,
  CheckCircle2,
  Leaf,
  FileText,
  Plus,
  Trash2,
  FileDown,
  Pencil,
  AlertCircle,
  ChevronDown,
  Search,
  Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";

/* ============================================
   CONSTANTS & TYPES
   ============================================ */

const WIZARD_STEPS = [
  { id: "identity", label: "Product Identity", icon: Tag },
  { id: "specs", label: "Technical Specs", icon: Cpu },
  { id: "composition", label: "Material Composition", icon: Layers },
  { id: "compliance", label: "Compliance & Certificates", icon: ShieldCheck },
  { id: "circularity", label: "Circularity & End-of-Life", icon: Recycle },
  { id: "carbon", label: "Carbon & Environmental", icon: Leaf },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "supplychain", label: "Supply Chain", icon: Truck },
  { id: "review", label: "Review & Submit", icon: CheckCircle2 },
] as const;

type StepId = (typeof WIZARD_STEPS)[number]["id"];

interface ModuleModel {
  id: string;
  label: string;
  company: string;
  manufacturer: string;
  manufacturerAddress: string;
  manufacturerUrl: string;
  power: number;
  technology: string;
  efficiency: number;
  voc: number;
  isc: number;
  vmp: number;
  imp: number;
  maxSystemVoltage: number;
  length: number;
  width: number;
  depth: number;
  mass: number;
  cellCount: number;
  cellType: string;
  tempCoeffPmax: string;
  tempCoeffVoc: string;
  tempCoeffIsc: string;
  noct: string;
  fireRating: string;
  ipRating: string;
  connectorType: string;
  frameType: string;
  glassType: string;
  bifacialityFactor: string;
  warrantyYears: string;
  performanceWarranty: string;
  degradationRate: string;
  expectedLifetime: string;
  facility: string;
  certIssuer: string;
  recyclerName: string;
  recyclerContact: string;
}

// Company-specific shared defaults
const WRM_COMPANY = {
  company: "Roshan", manufacturer: "Roshan",
  manufacturerAddress: "602 Western Edge II, Borivali East, Mumbai 400066",
  manufacturerUrl: "https://waaree.com",
  certIssuer: "TUV Rheinland", recyclerName: "Veolia PV Recycling", recyclerContact: "pvrecycling@veolia.com",
};
const ADS_COMPANY = {
  company: "Adani Solar", manufacturer: "Mundra Solar PV Ltd. (Adani Solar)",
  manufacturerAddress: "Adani Corporate House, Shantigram, Ahmedabad 382421",
  manufacturerUrl: "https://www.adanisolar.com",
  certIssuer: "Bureau Veritas", recyclerName: "First Solar Recycling", recyclerContact: "recycling@firstsolar.com",
};
const VKS_COMPANY = {
  company: "Vikram Solar", manufacturer: "Vikram Solar Limited",
  manufacturerAddress: "Chinar Park, Rajarhat, Kolkata, WB 700156",
  manufacturerUrl: "https://www.vikramsolar.com",
  certIssuer: "UL LLC", recyclerName: "ROSI Solar", recyclerContact: "contact@rfrosi.com",
};

const MODULE_MODELS: ModuleModel[] = [
  // ── Roshan ──
  {
    id: "WRM-700-TOPCON-BiN-03", label: "WRM-700-TOPCON-BiN-03 (700W TOPCon)", ...WRM_COMPANY,
    power: 700, technology: "crystalline_silicon_topcon", efficiency: 22.53,
    voc: 54.80, isc: 18.30, vmp: 46.10, imp: 17.40, maxSystemVoltage: 1500,
    length: 2384, width: 1303, depth: 35, mass: 39.0, cellCount: 132,
    cellType: "G12 N-type TOPCon bifacial", facility: "FAC-WRM-SRT-001",
    tempCoeffPmax: "-0.30", tempCoeffVoc: "-0.25", tempCoeffIsc: "0.045",
    noct: "43", fireRating: "Class A", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 35mm",
    glassType: "2mm Low Iron HTAR semi-tempered", bifacialityFactor: "0.80",
    warrantyYears: "12", performanceWarranty: "87.4", degradationRate: "0.40", expectedLifetime: "35",
  },
  {
    id: "WRM-590-TOPCON-BiN-08", label: "WRM-590-TOPCON-BiN-08 (590W TOPCon)", ...WRM_COMPANY,
    power: 590, technology: "crystalline_silicon_topcon", efficiency: 22.84,
    voc: 51.80, isc: 14.60, vmp: 43.80, imp: 13.47, maxSystemVoltage: 1500,
    length: 2278, width: 1134, depth: 33, mass: 32.5, cellCount: 144,
    cellType: "M10 N-type TOPCon bifacial", facility: "FAC-WRM-SRT-001",
    tempCoeffPmax: "-0.30", tempCoeffVoc: "-0.26", tempCoeffIsc: "0.046",
    noct: "43", fireRating: "Class A", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 33mm",
    glassType: "2mm Low Iron ARC tempered", bifacialityFactor: "0.80",
    warrantyYears: "12", performanceWarranty: "87.4", degradationRate: "0.40", expectedLifetime: "35",
  },
  {
    id: "WRM-580-TOPCON-BiN-08", label: "WRM-580-TOPCON-BiN-08 (580W TOPCon)", ...WRM_COMPANY,
    power: 580, technology: "crystalline_silicon_topcon", efficiency: 22.45,
    voc: 51.20, isc: 14.50, vmp: 43.20, imp: 13.43, maxSystemVoltage: 1500,
    length: 2278, width: 1134, depth: 33, mass: 32.5, cellCount: 144,
    cellType: "M10 N-type TOPCon bifacial", facility: "FAC-WRM-CHK-002",
    tempCoeffPmax: "-0.29", tempCoeffVoc: "-0.24", tempCoeffIsc: "0.044",
    noct: "43", fireRating: "Class A", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 33mm",
    glassType: "2mm Low Iron ARC tempered", bifacialityFactor: "0.75",
    warrantyYears: "12", performanceWarranty: "87.4", degradationRate: "0.40", expectedLifetime: "35",
  },
  {
    id: "WRM-685-TOPCON-BiN-03", label: "WRM-685-TOPCON-BiN-03 (685W TOPCon)", ...WRM_COMPANY,
    power: 685, technology: "crystalline_silicon_topcon", efficiency: 22.05,
    voc: 53.90, isc: 18.10, vmp: 45.30, imp: 17.20, maxSystemVoltage: 1500,
    length: 2384, width: 1303, depth: 33, mass: 37.8, cellCount: 132,
    cellType: "G12 N-type TOPCon bifacial", facility: "FAC-WRM-TMB-003",
    tempCoeffPmax: "-0.30", tempCoeffVoc: "-0.25", tempCoeffIsc: "0.045",
    noct: "43", fireRating: "Class A", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 35mm",
    glassType: "2mm Low Iron ARC semi-tempered (dual glass)", bifacialityFactor: "0.80",
    warrantyYears: "12", performanceWarranty: "87.4", degradationRate: "0.40", expectedLifetime: "35",
  },
  {
    id: "WRM-625-TOPCON-BiN-17", label: "WRM-625-TOPCON-BiN-17 (625W TOPCon 156-cell)", ...WRM_COMPANY,
    power: 625, technology: "crystalline_silicon_topcon", efficiency: 22.36,
    voc: 53.40, isc: 14.90, vmp: 44.60, imp: 14.01, maxSystemVoltage: 1500,
    length: 2465, width: 1134, depth: 33, mass: 35.0, cellCount: 156,
    cellType: "M10 N-type TOPCon bifacial", facility: "FAC-WRM-NDG-004",
    tempCoeffPmax: "-0.30", tempCoeffVoc: "-0.26", tempCoeffIsc: "0.046",
    noct: "43", fireRating: "Class A", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 33mm",
    glassType: "3.2mm Low Iron Tempered ARC", bifacialityFactor: "0.80",
    warrantyYears: "12", performanceWarranty: "87.4", degradationRate: "0.40", expectedLifetime: "35",
  },
  {
    id: "WRM-645-TOPCON-BiN-17", label: "WRM-645-TOPCON-BiN-17 (645W TOPCon 156-cell)", ...WRM_COMPANY,
    power: 645, technology: "crystalline_silicon_topcon", efficiency: 22.70,
    voc: 54.10, isc: 15.10, vmp: 45.20, imp: 14.27, maxSystemVoltage: 1500,
    length: 2465, width: 1134, depth: 33, mass: 35.2, cellCount: 156,
    cellType: "M10 N-type TOPCon bifacial", facility: "FAC-WRM-NDG-004",
    tempCoeffPmax: "-0.30", tempCoeffVoc: "-0.26", tempCoeffIsc: "0.046",
    noct: "43", fireRating: "Class A", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 33mm",
    glassType: "3.2mm Low Iron Tempered ARC", bifacialityFactor: "0.80",
    warrantyYears: "12", performanceWarranty: "87.4", degradationRate: "0.40", expectedLifetime: "35",
  },
  {
    id: "WRM-635-TOPCON-BiN-02", label: "WRM-635-TOPCON-BiN-02 (635W TOPCon 120-cell)", ...WRM_COMPANY,
    power: 635, technology: "crystalline_silicon_topcon", efficiency: 22.42,
    voc: 44.20, isc: 18.25, vmp: 37.00, imp: 17.16, maxSystemVoltage: 1500,
    length: 2172, width: 1303, depth: 35, mass: 35.5, cellCount: 120,
    cellType: "G12 N-type TOPCon bifacial", facility: "FAC-WRM-SRT-001",
    tempCoeffPmax: "-0.30", tempCoeffVoc: "-0.25", tempCoeffIsc: "0.045",
    noct: "43", fireRating: "Class A", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 35mm",
    glassType: "3.2mm Low Iron Tempered ARC", bifacialityFactor: "0.80",
    warrantyYears: "12", performanceWarranty: "87.4", degradationRate: "0.40", expectedLifetime: "35",
  },
  {
    id: "WRM-620-TOPCON-BiN-21R", label: "WRM-620-TOPCON-BiN-21R (620W TOPCon Elite R)", ...WRM_COMPANY,
    power: 620, technology: "crystalline_silicon_topcon", efficiency: 22.80,
    voc: 53.50, isc: 14.80, vmp: 44.80, imp: 13.84, maxSystemVoltage: 1500,
    length: 2384, width: 1134, depth: 33, mass: 33.0, cellCount: 132,
    cellType: "G12R N-type TOPCon bifacial", facility: "FAC-WRM-SMK-005",
    tempCoeffPmax: "-0.30", tempCoeffVoc: "-0.25", tempCoeffIsc: "0.045",
    noct: "43", fireRating: "Class A", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 33mm",
    glassType: "3.2mm Low Iron Tempered ARC", bifacialityFactor: "0.80",
    warrantyYears: "12", performanceWarranty: "87.4", degradationRate: "0.40", expectedLifetime: "35",
  },
  {
    id: "WRM-540-PERC-WSMD", label: "WRM-540-PERC-WSMD (540W Arka PERC)", ...WRM_COMPANY,
    power: 540, technology: "crystalline_silicon_perc", efficiency: 20.98,
    voc: 49.61, isc: 13.83, vmp: 40.67, imp: 12.95, maxSystemVoltage: 1500,
    length: 2278, width: 1134, depth: 35, mass: 28.5, cellCount: 144,
    cellType: "M10 P-type mono PERC", facility: "FAC-WRM-CHK-002",
    tempCoeffPmax: "-0.34", tempCoeffVoc: "-0.27", tempCoeffIsc: "0.048",
    noct: "45", fireRating: "Class A", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 35mm",
    glassType: "3.2mm Low Iron Tempered ARC", bifacialityFactor: "0",
    warrantyYears: "10", performanceWarranty: "84.8", degradationRate: "0.55", expectedLifetime: "30",
  },
  {
    id: "WRM-400-PERC-WSMD-RES", label: "WRM-400-PERC-WSMD-RES (400W Arka Residential)", ...WRM_COMPANY,
    power: 400, technology: "crystalline_silicon_perc", efficiency: 20.50,
    voc: 37.40, isc: 13.60, vmp: 31.00, imp: 12.90, maxSystemVoltage: 1500,
    length: 1722, width: 1134, depth: 30, mass: 21.5, cellCount: 108,
    cellType: "M10 P-type mono PERC half-cut", facility: "FAC-WRM-SRT-001",
    tempCoeffPmax: "-0.34", tempCoeffVoc: "-0.27", tempCoeffIsc: "0.048",
    noct: "45", fireRating: "Class A", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 30mm",
    glassType: "3.2mm Low Iron Tempered ARC", bifacialityFactor: "0",
    warrantyYears: "10", performanceWarranty: "84.8", degradationRate: "0.55", expectedLifetime: "30",
  },
  {
    id: "WRM-535-PERC-Bi55", label: "WRM-535-PERC-Bi55 (535W Ahnay Bifacial)", ...WRM_COMPANY,
    power: 535, technology: "crystalline_silicon_perc", efficiency: 20.70,
    voc: 49.30, isc: 13.80, vmp: 40.30, imp: 12.85, maxSystemVoltage: 1500,
    length: 2278, width: 1134, depth: 35, mass: 30.5, cellCount: 144,
    cellType: "M10 P-type mono PERC bifacial", facility: "FAC-WRM-TMB-003",
    tempCoeffPmax: "-0.35", tempCoeffVoc: "-0.28", tempCoeffIsc: "0.048",
    noct: "45", fireRating: "Class A", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 35mm",
    glassType: "2mm Tempered ARC (dual glass)", bifacialityFactor: "0.70",
    warrantyYears: "10", performanceWarranty: "84.8", degradationRate: "0.55", expectedLifetime: "30",
  },
  {
    id: "WRM-720-HJT-BIH-11", label: "WRM-720-HJT-BIH-11 (720W Plexus HJT)", ...WRM_COMPANY,
    power: 720, technology: "crystalline_silicon_hjt", efficiency: 23.20,
    voc: 55.40, isc: 18.60, vmp: 46.90, imp: 17.50, maxSystemVoltage: 1500,
    length: 2384, width: 1303, depth: 33, mass: 37.0, cellCount: 144,
    cellType: "G12 N-type Heterojunction bifacial", facility: "FAC-WRM-SMK-005",
    tempCoeffPmax: "-0.26", tempCoeffVoc: "-0.24", tempCoeffIsc: "0.040",
    noct: "42", fireRating: "Class A", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 33mm",
    glassType: "3.2mm Tempered ARC (dual glass)", bifacialityFactor: "0.90",
    warrantyYears: "15", performanceWarranty: "90.0", degradationRate: "0.25", expectedLifetime: "40",
  },
  {
    id: "WRM-330-POLY-WS", label: "WRM-330-POLY-WS (330W Aditya Polycrystalline)", ...WRM_COMPANY,
    power: 330, technology: "other", efficiency: 17.01,
    voc: 46.70, isc: 9.25, vmp: 37.95, imp: 8.70, maxSystemVoltage: 1000,
    length: 1960, width: 992, depth: 35, mass: 22.5, cellCount: 72,
    cellType: "Polycrystalline silicon (Multi-Si)", facility: "FAC-WRM-TMB-003",
    tempCoeffPmax: "-0.40", tempCoeffVoc: "-0.30", tempCoeffIsc: "0.050",
    noct: "47", fireRating: "Class C", ipRating: "IP65",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 35mm",
    glassType: "3.2mm Tempered Solar Glass", bifacialityFactor: "0",
    warrantyYears: "10", performanceWarranty: "80.0", degradationRate: "0.70", expectedLifetime: "25",
  },
  // ── Adani Solar ──
  {
    id: "ASM-590-TOPCON-BiN", label: "ASM-590-TOPCON-BiN (590W TOPCon)", ...ADS_COMPANY,
    power: 590, technology: "crystalline_silicon_topcon", efficiency: 22.80,
    voc: 51.60, isc: 14.55, vmp: 43.50, imp: 13.56, maxSystemVoltage: 1500,
    length: 2278, width: 1134, depth: 33, mass: 32.0, cellCount: 144,
    cellType: "M10 N-type TOPCon bifacial", facility: "FAC-ADS-MND-001",
    tempCoeffPmax: "-0.30", tempCoeffVoc: "-0.26", tempCoeffIsc: "0.045",
    noct: "43", fireRating: "Class A", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 33mm",
    glassType: "3.2mm high-transmission tempered", bifacialityFactor: "0.80",
    warrantyYears: "12", performanceWarranty: "87.4", degradationRate: "0.40", expectedLifetime: "30",
  },
  {
    id: "ASM-580-TOPCON-BiN", label: "ASM-580-TOPCON-BiN (580W TOPCon)", ...ADS_COMPANY,
    power: 580, technology: "crystalline_silicon_topcon", efficiency: 22.40,
    voc: 51.10, isc: 14.45, vmp: 43.00, imp: 13.49, maxSystemVoltage: 1500,
    length: 2278, width: 1134, depth: 33, mass: 32.0, cellCount: 144,
    cellType: "M10 N-type TOPCon bifacial", facility: "FAC-ADS-MND-001",
    tempCoeffPmax: "-0.29", tempCoeffVoc: "-0.25", tempCoeffIsc: "0.044",
    noct: "43", fireRating: "Class A", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 33mm",
    glassType: "3.2mm high-transmission tempered", bifacialityFactor: "0.78",
    warrantyYears: "12", performanceWarranty: "87.4", degradationRate: "0.40", expectedLifetime: "30",
  },
  {
    id: "ASM-545-PERC-Mono", label: "ASM-545-PERC-Mono (545W PERC)", ...ADS_COMPANY,
    power: 545, technology: "crystalline_silicon_perc", efficiency: 21.10,
    voc: 49.50, isc: 13.90, vmp: 41.50, imp: 13.13, maxSystemVoltage: 1500,
    length: 2278, width: 1134, depth: 35, mass: 28.0, cellCount: 144,
    cellType: "M10 P-type mono PERC", facility: "FAC-ADS-MND-001",
    tempCoeffPmax: "-0.35", tempCoeffVoc: "-0.28", tempCoeffIsc: "0.048",
    noct: "45", fireRating: "Class C", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 35mm",
    glassType: "3.2mm tempered glass", bifacialityFactor: "0",
    warrantyYears: "12", performanceWarranty: "84.8", degradationRate: "0.55", expectedLifetime: "30",
  },
  // ── Vikram Solar ──
  {
    id: "VSMDH-595-TOPCON", label: "VSMDH-595-TOPCON (595W TOPCon)", ...VKS_COMPANY,
    power: 595, technology: "crystalline_silicon_topcon", efficiency: 23.06,
    voc: 51.50, isc: 14.37, vmp: 43.40, imp: 13.72, maxSystemVoltage: 1500,
    length: 2278, width: 1134, depth: 30, mass: 33.4, cellCount: 144,
    cellType: "M10 N-type TOPCon bifacial", facility: "FAC-VKS-FLT-001",
    tempCoeffPmax: "-0.30", tempCoeffVoc: "-0.26", tempCoeffIsc: "0.045",
    noct: "45", fireRating: "Class C", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 30mm",
    glassType: "2.0mm ARC semi-tempered", bifacialityFactor: "0.85",
    warrantyYears: "12", performanceWarranty: "87.4", degradationRate: "0.40", expectedLifetime: "35",
  },
  {
    id: "VSMDH-590-TOPCON", label: "VSMDH-590-TOPCON (590W TOPCon)", ...VKS_COMPANY,
    power: 590, technology: "crystalline_silicon_topcon", efficiency: 22.87,
    voc: 50.30, isc: 14.32, vmp: 43.20, imp: 13.67, maxSystemVoltage: 1500,
    length: 2278, width: 1134, depth: 30, mass: 33.4, cellCount: 144,
    cellType: "M10 N-type TOPCon bifacial", facility: "FAC-VKS-OGD-002",
    tempCoeffPmax: "-0.30", tempCoeffVoc: "-0.26", tempCoeffIsc: "0.045",
    noct: "45", fireRating: "Class C", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 30mm",
    glassType: "2.0mm ARC semi-tempered", bifacialityFactor: "0.82",
    warrantyYears: "12", performanceWarranty: "87.4", degradationRate: "0.40", expectedLifetime: "35",
  },
  {
    id: "VSMDH-580-TOPCON", label: "VSMDH-580-TOPCON (580W TOPCon)", ...VKS_COMPANY,
    power: 580, technology: "crystalline_silicon_topcon", efficiency: 22.49,
    voc: 50.70, isc: 14.14, vmp: 42.80, imp: 13.55, maxSystemVoltage: 1500,
    length: 2278, width: 1134, depth: 30, mass: 33.4, cellCount: 144,
    cellType: "M10 N-type TOPCon bifacial", facility: "FAC-VKS-FLT-001",
    tempCoeffPmax: "-0.29", tempCoeffVoc: "-0.25", tempCoeffIsc: "0.044",
    noct: "45", fireRating: "Class C", ipRating: "IP68",
    connectorType: "MC4 Compatible", frameType: "Anodized aluminium alloy, 30mm",
    glassType: "2.0mm ARC semi-tempered", bifacialityFactor: "0.80",
    warrantyYears: "12", performanceWarranty: "87.4", degradationRate: "0.40", expectedLifetime: "35",
  },
];

const FACILITIES = [
  { id: "FAC-WRM-SRT-001", label: "Waaree Surat SEZ GigaFactory, Gujarat" },
  { id: "FAC-WRM-CHK-002", label: "Waaree Chikhli Plant, Gujarat" },
  { id: "FAC-WRM-TMB-003", label: "Waaree Tumb Manufacturing Plant, Gujarat" },
  { id: "FAC-WRM-NDG-004", label: "Waaree Nandigram Plant, Gujarat" },
  { id: "FAC-WRM-SMK-005", label: "Waaree Samakhiali Mega Plant, Kutch, Gujarat" },
  { id: "FAC-ADS-MND-001", label: "Adani Mundra GigaFactory, Kutch, Gujarat" },
  { id: "FAC-VKS-FLT-001", label: "Vikram Solar Falta SEZ, West Bengal" },
  { id: "FAC-VKS-OGD-002", label: "Vikram Solar Oragadam Plant, Chennai" },
];

const TECHNOLOGIES = [
  { value: "crystalline_silicon_topcon", label: "TOPCon" },
  { value: "crystalline_silicon_perc", label: "PERC" },
  { value: "crystalline_silicon_hjt", label: "HJT" },
  { value: "thin_film_cdte", label: "CdTe" },
  { value: "thin_film_cigs", label: "CIGS" },
  { value: "other", label: "Other" },
];

const CERTIFICATE_STANDARDS = [
  { value: "IEC 61215", label: "IEC 61215 (Design Qualification)" },
  { value: "IEC 61730", label: "IEC 61730 (Safety)" },
  { value: "IEC 61701", label: "IEC 61701 (Salt Mist Corrosion)" },
  { value: "IEC 62716", label: "IEC 62716 (Ammonia Corrosion)" },
  { value: "UL 61730", label: "UL 61730 (North America Safety)" },
  { value: "BIS IS 14286", label: "BIS IS 14286 (India)" },
  { value: "CE Declaration", label: "CE Declaration of Conformity" },
  { value: "ISO 14067", label: "Carbon Footprint Verification (ISO 14067)" },
];

const CERT_STATUSES = [
  { value: "valid", label: "Valid" },
  { value: "pending", label: "Pending" },
  { value: "expired", label: "Expired" },
];

interface BomItem {
  id: string;
  materialName: string;
  componentType: string;
  massGrams: number;
  massPercent: number;
  casNumber: string;
  isCriticalRaw: boolean;
  isSubstanceOfConcern: boolean;
}

interface Certificate {
  id: string;
  standard: string;
  certificateNumber: string;
  issuer: string;
  issuedDate: string;
  expiryDate: string;
  status: string;
  documentUrl: string;
  scopeNotes: string;
}

const TEMPLATE_DOCUMENTS = (company: string) => [
  { name: `${company} - Datasheet`, documentType: "datasheet", accessLevel: "public", url: "", issuer: company, issuedDate: "2025-07-01" },
  { name: "Declaration of Conformity", documentType: "declaration_of_conformity", accessLevel: "public", url: "", issuer: company, issuedDate: "2025-07-01" },
  { name: "User Manual", documentType: "user_manual", accessLevel: "public", url: "", issuer: company, issuedDate: "2025-07-01" },
  { name: "Safety Instructions", documentType: "safety_instructions", accessLevel: "public", url: "", issuer: company, issuedDate: "2025-07-01" },
  { name: "Environmental Product Declaration", documentType: "epd", accessLevel: "public", url: "", issuer: company, issuedDate: "2025-07-01" },
  { name: "Recycling Guide", documentType: "recycling_guide", accessLevel: "recycler", url: "", issuer: company, issuedDate: "2025-07-01" },
];

const TEMPLATE_BOM: Omit<BomItem, "id">[] = [
  { materialName: "Tempered Solar Glass", componentType: "Cover Glass", massGrams: 21700, massPercent: 64.6, casNumber: "65997-17-3", isCriticalRaw: false, isSubstanceOfConcern: false },
  { materialName: "Aluminium Alloy 6063-T5", componentType: "Frame", massGrams: 4335, massPercent: 12.9, casNumber: "7429-90-5", isCriticalRaw: false, isSubstanceOfConcern: false },
  { materialName: "EVA (Ethylene-Vinyl Acetate)", componentType: "Encapsulant", massGrams: 2890, massPercent: 8.6, casNumber: "24937-78-8", isCriticalRaw: false, isSubstanceOfConcern: false },
  { materialName: "Monocrystalline Silicon (N-Type)", componentType: "Solar Cells", massGrams: 2184, massPercent: 6.5, casNumber: "7440-21-3", isCriticalRaw: true, isSubstanceOfConcern: false },
  { materialName: "Fluoropolymer Backsheet", componentType: "Backsheet", massGrams: 1142, massPercent: 3.4, casNumber: "9002-84-0", isCriticalRaw: false, isSubstanceOfConcern: false },
  { materialName: "Copper Ribbon", componentType: "Interconnects", massGrams: 672, massPercent: 2.0, casNumber: "7440-50-8", isCriticalRaw: true, isSubstanceOfConcern: false },
  { materialName: "Other (Junction Box, Sealants, Adhesives)", componentType: "Miscellaneous", massGrams: 605, massPercent: 1.8, casNumber: "", isCriticalRaw: false, isSubstanceOfConcern: false },
  { materialName: "Tin (Solder)", componentType: "Solder", massGrams: 27, massPercent: 0.08, casNumber: "7440-31-5", isCriticalRaw: false, isSubstanceOfConcern: false },
  { materialName: "Silver Paste", componentType: "Cell Metallization", massGrams: 20, massPercent: 0.06, casNumber: "7440-22-4", isCriticalRaw: true, isSubstanceOfConcern: false },
  { materialName: "Lead (Solder Trace)", componentType: "Solder", massGrams: 7, massPercent: 0.02, casNumber: "7439-92-1", isCriticalRaw: false, isSubstanceOfConcern: true },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function generatePassportId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PVP-${year}-${rand}`;
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/* ============================================
   FORM DATA STRUCTURE
   ============================================ */

interface FormData {
  // Identity
  passportId: string;
  publicId: string;
  modelId: string;
  serialNumber: string;
  batchId: string;
  gtin: string;
  manufacturer: string;
  facility: string;
  manufacturingDate: string;
  technology: string;
  // Specs
  ratedPower: string;
  efficiency: string;
  voc: string;
  isc: string;
  vmp: string;
  imp: string;
  maxSystemVoltage: string;
  length: string;
  width: string;
  depth: string;
  mass: string;
  cellCount: string;
  cellType: string;
  tempCoeffPmax: string;
  tempCoeffVoc: string;
  tempCoeffIsc: string;
  noct: string;
  fireRating: string;
  ipRating: string;
  connectorType: string;
  frameType: string;
  glassType: string;
  bifacialityFactor: string;
  warrantyYears: string;
  performanceWarranty: string;
  degradationRate: string;
  expectedLifetime: string;
  // Composition
  bom: BomItem[];
  // Compliance
  certificates: Certificate[];
  // Circularity
  recyclabilityRate: string;
  recycledContent: string;
  renewableContent: string;
  isHazardous: boolean;
  hazardousNotes: string;
  dismantlingTime: string;
  dismantlingInstructions: string;
  collectionScheme: string;
  recyclerName: string;
  recyclerContact: string;
  recoveryAluminium: boolean;
  recoveryGlass: boolean;
  recoverySilicon: boolean;
  recoveryCopper: boolean;
  recoverySilver: boolean;
  recoveryNotes: string;
  eolStatus: string;
  // Carbon & Environmental
  carbonFootprint: string;
  carbonIntensity: string;
  carbonLcaBoundary: string;
  carbonMethodology: string;
  carbonVerificationRef: string;
  // Documents
  documents: Array<{
    name: string;
    documentType: string;
    accessLevel: string;
    url: string;
    issuer: string;
    issuedDate: string;
  }>;
  // Manufacturer details (in identity step)
  manufacturerOperatorId: string;
  manufacturerCountry: string;
  manufacturerAddress: string;
  manufacturerContactUrl: string;
  facilityCountry: string;
  // Importer (in identity step)
  importerName: string;
  importerOperatorId: string;
  importerCountry: string;
  // REACH/RoHS (in circularity step)
  reachStatus: string;
  rohsStatus: string;
  // Supply Chain
  supplyChainActors: SupplyChainActor[];
}

interface SupplyChainActor {
  id: string;
  actorName: string;
  actorRole: string;
  country: string;
  facilityName: string;
  tierLevel: string;
  uflpaCompliant: boolean;
}

function initialFormData(): FormData {
  return {
    passportId: "",
    publicId: "",
    modelId: "",
    serialNumber: "",
    batchId: "",
    gtin: "",
    manufacturer: "",
    facility: "",
    manufacturingDate: "",
    technology: "",
    ratedPower: "",
    efficiency: "",
    voc: "",
    isc: "",
    vmp: "",
    imp: "",
    maxSystemVoltage: "",
    length: "",
    width: "",
    depth: "",
    mass: "",
    cellCount: "",
    cellType: "",
    tempCoeffPmax: "-0.30",
    tempCoeffVoc: "-0.25",
    tempCoeffIsc: "0.045",
    noct: "45",
    fireRating: "Class A",
    ipRating: "IP68",
    connectorType: "MC4 Compatible",
    frameType: "Anodized Aluminium Alloy",
    glassType: "3.2mm Low Iron Tempered ARC",
    bifacialityFactor: "0.80",
    warrantyYears: "30",
    performanceWarranty: "87.4",
    degradationRate: "0.40",
    expectedLifetime: "30",
    bom: [],
    certificates: [],
    recyclabilityRate: "92.5",
    recycledContent: "15.0",
    renewableContent: "0",
    isHazardous: false,
    hazardousNotes: "",
    dismantlingTime: "25",
    dismantlingInstructions: "",
    collectionScheme: "WEEE Directive (EU) / E-Waste Management Rules (India)",
    recyclerName: "",
    recyclerContact: "",
    recoveryAluminium: true,
    recoveryGlass: true,
    recoverySilicon: true,
    recoveryCopper: true,
    recoverySilver: true,
    recoveryNotes: "",
    eolStatus: "in_service",
    carbonFootprint: "",
    carbonIntensity: "",
    carbonLcaBoundary: "cradle_to_gate",
    carbonMethodology: "JRC_harmonized_2025",
    carbonVerificationRef: "",
    documents: [],
    manufacturerOperatorId: "",
    manufacturerCountry: "",
    manufacturerAddress: "",
    manufacturerContactUrl: "",
    facilityCountry: "",
    importerName: "",
    importerOperatorId: "",
    importerCountry: "",
    reachStatus: "compliant",
    rohsStatus: "compliant_with_exemption",
    supplyChainActors: [],
  };
}

/* ============================================
   VALIDATION
   ============================================ */

interface ValidationErrors {
  [key: string]: string;
}

function validateStep(step: StepId, data: FormData): ValidationErrors {
  const errors: ValidationErrors = {};
  if (step === "identity") {
    if (!data.modelId) errors.modelId = "Module model is required";
    if (!data.manufacturer) errors.manufacturer = "Manufacturer is required";
    if (!data.technology) errors.technology = "Technology is required";
  }
  if (step === "specs") {
    if (!data.ratedPower) errors.ratedPower = "Rated power is required";
    if (!data.efficiency) errors.efficiency = "Efficiency is required";
  }
  return errors;
}

/* ============================================
   SUB-COMPONENTS
   ============================================ */

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">
      {label}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-0.5 flex items-center gap-1 text-[0.6875rem] text-red-500">
      <AlertCircle className="h-3 w-3" />
      {message}
    </p>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  error,
  disabled,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  mono?: boolean;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "mt-1 block w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted disabled:text-muted-foreground",
          mono && "font-mono",
          error && "border-red-400 focus:border-red-500 focus:ring-red-500/30"
        )}
      />
      <FieldError message={error} />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label;
  const filtered = search
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase()),
      )
    : options;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <FieldLabel label={label} required={required} />
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setSearch("");
        }}
        className={cn(
          "mt-1 flex w-full items-center justify-between border border-border bg-background px-3 py-2 text-left text-sm transition-colors hover:border-muted-foreground/70",
          value ? "text-foreground" : "text-muted-foreground",
          open && "border-primary ring-1 ring-[#22C55E]",
          error &&
            !open &&
            "border-red-400 focus:border-red-500 focus:ring-red-500/30",
        )}
      >
        <span className="truncate">
          {selectedLabel ?? placeholder ?? "Select..."}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full border border-border bg-background shadow-lg"
          >
            {options.length > 5 && (
              <div className="border-b border-muted p-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    autoFocus
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full border border-border bg-muted py-1.5 pl-7 pr-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            )}
            <ul className="max-h-48 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-xs text-muted-foreground">
                  No results found
                </li>
              ) : (
                filtered.map((o) => (
                  <li key={o.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(o.value);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                        o.value === value &&
                          "bg-[var(--passport-green-muted)] font-medium text-foreground",
                      )}
                    >
                      {o.value === value && (
                        <CheckCircle2 className="h-3 w-3 shrink-0 text-primary" />
                      )}
                      <span className={o.value === value ? "" : "ml-5"}>
                        {o.label}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <FieldError message={error} />
    </div>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  description?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "mt-0.5 flex h-5 w-9 shrink-0 items-center border-2 transition-colors",
          checked
            ? "border-primary bg-primary"
            : "border-border bg-muted"
        )}
      >
        <span
          className={cn(
            "block h-3.5 w-3.5 bg-background transition-transform",
            checked ? "translate-x-[15px]" : "translate-x-[1px]"
          )}
        />
      </button>
      <div>
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <FieldLabel label={label} />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y"
      />
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

/* ============================================
   STEP COMPONENTS
   ============================================ */

function StepIdentity({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
  errors: ValidationErrors;
}) {
  const handleModelSelect = useCallback(
    (modelId: string) => {
      const model = MODULE_MODELS.find((m) => m.id === modelId);
      if (model) {
        const isPERC = model.technology === "crystalline_silicon_perc";
        onChange({
          modelId,
          manufacturer: model.manufacturer,
          technology: model.technology,
          facility: model.facility,
          ratedPower: String(model.power),
          efficiency: String(model.efficiency),
          voc: String(model.voc),
          isc: String(model.isc),
          vmp: String(model.vmp),
          imp: String(model.imp),
          maxSystemVoltage: String(model.maxSystemVoltage),
          length: String(model.length),
          width: String(model.width),
          depth: String(model.depth),
          mass: String(model.mass),
          cellCount: String(model.cellCount),
          cellType: model.cellType,
          tempCoeffPmax: model.tempCoeffPmax,
          tempCoeffVoc: model.tempCoeffVoc,
          tempCoeffIsc: model.tempCoeffIsc,
          noct: model.noct,
          fireRating: model.fireRating,
          ipRating: model.ipRating,
          connectorType: model.connectorType,
          frameType: model.frameType,
          glassType: model.glassType,
          bifacialityFactor: model.bifacialityFactor,
          warrantyYears: model.warrantyYears,
          performanceWarranty: model.performanceWarranty,
          degradationRate: model.degradationRate,
          expectedLifetime: model.expectedLifetime,
          bom: TEMPLATE_BOM.map((item) => ({ ...item, id: generateId() })),
          manufacturerOperatorId: model.company === "Roshan" ? "OP-WRM-IN-2024" : model.company === "Adani Solar" ? "OP-ADS-IN-2024" : "OP-VKS-IN-2024",
          manufacturerCountry: "India",
          manufacturerAddress: model.manufacturerAddress,
          manufacturerContactUrl: model.manufacturerUrl,
          facilityCountry: "India",
          certificates: [
            { id: generateId(), standard: "IEC 61215", certificateNumber: "IEC-61215-2025-" + modelId.substring(0, 7), issuer: model.certIssuer, issuedDate: "2025-08-15", expiryDate: "2029-08-14", status: "valid" as const, documentUrl: "", scopeNotes: "Terrestrial PV modules — Design qualification and type approval" },
            { id: generateId(), standard: "IEC 61730", certificateNumber: "IEC-61730-2025-" + modelId.substring(0, 7), issuer: model.certIssuer, issuedDate: "2025-09-01", expiryDate: "2029-08-31", status: "valid" as const, documentUrl: "", scopeNotes: "PV module safety qualification — Class A (general access)" },
            { id: generateId(), standard: "IEC 61701", certificateNumber: "IEC-61701-2025-" + modelId.substring(0, 7), issuer: model.certIssuer, issuedDate: "2025-10-01", expiryDate: "2029-09-30", status: "valid" as const, documentUrl: "", scopeNotes: "Salt mist corrosion testing — Severity 6" },
            { id: generateId(), standard: "BIS IS 14286", certificateNumber: "BIS-R-" + Math.floor(10000 + Math.random() * 90000), issuer: "Bureau of Indian Standards", issuedDate: "2025-07-01", expiryDate: "2028-06-30", status: "valid" as const, documentUrl: "", scopeNotes: "Indian standard for crystalline silicon PV modules" },
            { id: generateId(), standard: "CE Declaration", certificateNumber: "CE-DoC-" + modelId.substring(0, 3) + "-2025", issuer: model.manufacturer, issuedDate: "2025-08-01", expiryDate: "2030-07-31", status: "valid" as const, documentUrl: "", scopeNotes: "EU Declaration of Conformity — Low Voltage Directive 2014/35/EU" },
          ],
          recyclabilityRate: "92",
          recycledContent: isPERC ? "22" : "28",
          renewableContent: "0",
          isHazardous: true,
          hazardousNotes: "Contains lead traces in solder alloy (<0.1% by weight). RoHS exemption 7(a) applies.",
          dismantlingTime: "35",
          dismantlingInstructions: "1. Disconnect and verify zero voltage\n2. Remove mounting clamps (2-person lift for >30kg)\n3. Separate junction box and cables\n4. Remove aluminium frame (hand tools)\n5. Separate glass via thermal delamination (350°C)\n6. Recover silicon, copper, silver via chemical processing",
          collectionScheme: "EU WEEE Directive 2012/19/EU / India E-Waste Management Rules 2022",
          recyclerName: model.recyclerName,
          recyclerContact: model.recyclerContact,
          recoveryAluminium: true,
          recoveryGlass: true,
          recoverySilicon: true,
          recoveryCopper: true,
          recoverySilver: true,
          recoveryNotes: "95%+ aluminium recovery via mechanical separation. Glass recovery via thermal delamination at 500°C.",
          eolStatus: "in_service",
          carbonFootprint: isPERC ? "750" : String(800 + Math.round(model.power / 14)),
          carbonIntensity: isPERC ? "24.0" : "22.5",
          carbonLcaBoundary: "cradle_to_gate",
          carbonMethodology: "JRC_harmonized_2025",
          carbonVerificationRef: model.company === "Roshan"
            ? "EPD-WRM-2025-001"
            : model.company === "Adani Solar"
              ? "EPD-ADS-2025-001"
              : "EPD-VKS-2025-001",
          reachStatus: "compliant",
          rohsStatus: "compliant_with_exemption",
          documents: TEMPLATE_DOCUMENTS(model.company),
          supplyChainActors: [
            { id: generateId(), actorName: "Tongwei Co., Ltd.", actorRole: "Polysilicon Supplier", country: "China", facilityName: "Leshan Facility", tierLevel: "4", uflpaCompliant: true },
            { id: generateId(), actorName: "LONGi Green Energy", actorRole: "Wafer Manufacturer", country: "China", facilityName: "Xian Wafer Plant", tierLevel: "3", uflpaCompliant: true },
            { id: generateId(), actorName: model.manufacturer, actorRole: "Cell & Module Manufacturer", country: "India", facilityName: model.facility, tierLevel: "1", uflpaCompliant: true },
            { id: generateId(), actorName: "Kuehne+Nagel", actorRole: "Logistics Provider", country: "Germany", facilityName: "Hamburg Hub", tierLevel: "1", uflpaCompliant: true },
          ],
        });
      } else {
        onChange({ modelId });
      }
    },
    [onChange]
  );

  return (
    <div className="space-y-5">
      {/* Quick-fill demo button — loads WRM-700 data across all steps */}
      {!data.modelId && (
        <button
          type="button"
          onClick={() => handleModelSelect("WRM-700-TOPCON-BiN-03")}
          className="w-full border-2 border-dashed border-primary bg-[var(--passport-green-muted)] px-4 py-3 text-left transition-colors hover:bg-primary/20"
        >
          <p className="text-xs font-bold text-primary">Quick Fill: WRM-700-TOPCON-BiN-03</p>
          <p className="text-[10px] text-muted-foreground">Auto-populate all steps with real Waaree 700W TOPCon module data</p>
        </button>
      )}

      {/* Auto-generated IDs */}
      <div className="bg-muted border border-dashed border-border px-4 py-3">
        <p className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Auto-Generated Identifiers
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-1">
          <div>
            <span className="text-xs text-muted-foreground">Passport ID: </span>
            <span className="font-mono text-xs font-semibold text-foreground">
              {data.passportId}
            </span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Public ID: </span>
            <span className="font-mono text-[0.65rem] text-muted-foreground">
              {data.publicId}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Module Model"
          value={data.modelId}
          onChange={handleModelSelect}
          options={MODULE_MODELS.map((m) => ({ value: m.id, label: m.label }))}
          placeholder="Select a Waaree module..."
          required
          error={errors.modelId}
        />
        <TextField
          label="Serial Number"
          value={data.serialNumber}
          onChange={(v) => onChange({ serialNumber: v })}
          placeholder="e.g. SN-2026-0001-A"
          mono
        />
        <TextField
          label="Batch ID"
          value={data.batchId}
          onChange={(v) => onChange({ batchId: v })}
          placeholder="e.g. BATCH-SRT-2026-04"
          mono
        />
        <TextField
          label="GTIN"
          value={data.gtin}
          onChange={(v) => onChange({ gtin: v })}
          placeholder="14-digit Global Trade Item Number"
          mono
        />
        <TextField
          label="Manufacturer"
          value={data.manufacturer}
          onChange={(v) => onChange({ manufacturer: v })}
          placeholder="Manufacturer name"
          required
          disabled
          error={errors.manufacturer}
        />
        <SelectField
          label="Manufacturing Facility"
          value={data.facility}
          onChange={(v) => onChange({ facility: v })}
          options={FACILITIES.map((f) => ({ value: f.id, label: f.label }))}
          placeholder="Select facility..."
        />
        <TextField
          label="Manufacturing Date"
          value={data.manufacturingDate}
          onChange={(v) => onChange({ manufacturingDate: v })}
          type="date"
        />
        <SelectField
          label="Module Technology"
          value={data.technology}
          onChange={(v) => onChange({ technology: v })}
          options={TECHNOLOGIES}
          placeholder="Select technology..."
          required
          error={errors.technology}
        />
      </div>

      <SectionDivider label="Manufacturer Details" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TextField
          label="Operator ID"
          value={data.manufacturerOperatorId}
          onChange={(v) => onChange({ manufacturerOperatorId: v })}
          placeholder="e.g. OP-WRM-IN-2024"
          mono
        />
        <TextField
          label="Country"
          value={data.manufacturerCountry}
          onChange={(v) => onChange({ manufacturerCountry: v })}
          placeholder="e.g. India"
        />
        <TextField
          label="Address"
          value={data.manufacturerAddress}
          onChange={(v) => onChange({ manufacturerAddress: v })}
          placeholder="e.g. 602 Western Edge II, Borivali East, Mumbai"
        />
        <TextField
          label="Contact URL"
          value={data.manufacturerContactUrl}
          onChange={(v) => onChange({ manufacturerContactUrl: v })}
          placeholder="e.g. https://company.com"
        />
        <TextField
          label="Facility Country"
          value={data.facilityCountry}
          onChange={(v) => onChange({ facilityCountry: v })}
          placeholder="e.g. India"
        />
      </div>

      <SectionDivider label="EU Importer (required for non-EU manufacturers)" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TextField
          label="Importer Name"
          value={data.importerName}
          onChange={(v) => onChange({ importerName: v })}
          placeholder="e.g. SolarTech EU GmbH"
        />
        <TextField
          label="Importer Operator ID"
          value={data.importerOperatorId}
          onChange={(v) => onChange({ importerOperatorId: v })}
          placeholder="e.g. EU-OP-2025-00123"
          mono
        />
        <TextField
          label="Importer Country"
          value={data.importerCountry}
          onChange={(v) => onChange({ importerCountry: v })}
          placeholder="e.g. Germany"
        />
      </div>
    </div>
  );
}

function StepSpecs({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
  errors: ValidationErrors;
}) {
  return (
    <div className="space-y-5">
      <SectionDivider label="Electrical Performance (STC)" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TextField
          label="Rated Power (W)"
          value={data.ratedPower}
          onChange={(v) => onChange({ ratedPower: v })}
          placeholder="e.g. 700"
          type="number"
          required
          error={errors.ratedPower}
        />
        <TextField
          label="Efficiency (%)"
          value={data.efficiency}
          onChange={(v) => onChange({ efficiency: v })}
          placeholder="e.g. 22.53"
          type="number"
          required
          error={errors.efficiency}
        />
        <TextField
          label="Voc (V)"
          value={data.voc}
          onChange={(v) => onChange({ voc: v })}
          placeholder="Open circuit voltage"
          type="number"
        />
        <TextField
          label="Isc (A)"
          value={data.isc}
          onChange={(v) => onChange({ isc: v })}
          placeholder="Short circuit current"
          type="number"
        />
        <TextField
          label="Vmp (V)"
          value={data.vmp}
          onChange={(v) => onChange({ vmp: v })}
          placeholder="Voltage at max power"
          type="number"
        />
        <TextField
          label="Imp (A)"
          value={data.imp}
          onChange={(v) => onChange({ imp: v })}
          placeholder="Current at max power"
          type="number"
        />
        <TextField
          label="Max System Voltage (V)"
          value={data.maxSystemVoltage}
          onChange={(v) => onChange({ maxSystemVoltage: v })}
          placeholder="e.g. 1500"
          type="number"
        />
      </div>

      <SectionDivider label="Physical Dimensions" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TextField
          label="Length (mm)"
          value={data.length}
          onChange={(v) => onChange({ length: v })}
          placeholder="Module length"
          type="number"
        />
        <TextField
          label="Width (mm)"
          value={data.width}
          onChange={(v) => onChange({ width: v })}
          placeholder="Module width"
          type="number"
        />
        <TextField
          label="Depth (mm)"
          value={data.depth}
          onChange={(v) => onChange({ depth: v })}
          placeholder="Module depth"
          type="number"
        />
        <TextField
          label="Mass (kg)"
          value={data.mass}
          onChange={(v) => onChange({ mass: v })}
          placeholder="Module weight"
          type="number"
        />
        <TextField
          label="Cell Count"
          value={data.cellCount}
          onChange={(v) => onChange({ cellCount: v })}
          placeholder="e.g. 144"
          type="number"
        />
        <TextField
          label="Cell Type"
          value={data.cellType}
          onChange={(v) => onChange({ cellType: v })}
          placeholder="e.g. M10 N-Type Mono"
        />
      </div>

      <SectionDivider label="Temperature Coefficients" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TextField
          label="Pmax Coeff. (%/C)"
          value={data.tempCoeffPmax}
          onChange={(v) => onChange({ tempCoeffPmax: v })}
          placeholder="e.g. -0.30"
          type="number"
        />
        <TextField
          label="Voc Coeff. (%/C)"
          value={data.tempCoeffVoc}
          onChange={(v) => onChange({ tempCoeffVoc: v })}
          placeholder="e.g. -0.25"
          type="number"
        />
        <TextField
          label="Isc Coeff. (%/C)"
          value={data.tempCoeffIsc}
          onChange={(v) => onChange({ tempCoeffIsc: v })}
          placeholder="e.g. 0.045"
          type="number"
        />
        <TextField
          label="NOCT (C)"
          value={data.noct}
          onChange={(v) => onChange({ noct: v })}
          placeholder="e.g. 45"
          type="number"
        />
      </div>

      <SectionDivider label="Mechanical & Ratings" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TextField
          label="Fire Rating"
          value={data.fireRating}
          onChange={(v) => onChange({ fireRating: v })}
          placeholder="e.g. Class A"
        />
        <TextField
          label="IP Rating"
          value={data.ipRating}
          onChange={(v) => onChange({ ipRating: v })}
          placeholder="e.g. IP68"
        />
        <TextField
          label="Connector Type"
          value={data.connectorType}
          onChange={(v) => onChange({ connectorType: v })}
          placeholder="e.g. MC4 Compatible"
        />
        <TextField
          label="Frame Type"
          value={data.frameType}
          onChange={(v) => onChange({ frameType: v })}
          placeholder="e.g. Anodized Aluminium"
        />
        <TextField
          label="Glass Type"
          value={data.glassType}
          onChange={(v) => onChange({ glassType: v })}
          placeholder="e.g. 3.2mm Low Iron ARC"
        />
        <TextField
          label="Bifaciality Factor"
          value={data.bifacialityFactor}
          onChange={(v) => onChange({ bifacialityFactor: v })}
          placeholder="e.g. 0.80"
          type="number"
        />
      </div>

      <SectionDivider label="Warranty & Lifetime" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TextField
          label="Warranty (Years)"
          value={data.warrantyYears}
          onChange={(v) => onChange({ warrantyYears: v })}
          placeholder="e.g. 30"
          type="number"
        />
        <TextField
          label="Performance Warranty (%)"
          value={data.performanceWarranty}
          onChange={(v) => onChange({ performanceWarranty: v })}
          placeholder="e.g. 87.4"
          type="number"
        />
        <TextField
          label="Degradation Rate (%/yr)"
          value={data.degradationRate}
          onChange={(v) => onChange({ degradationRate: v })}
          placeholder="e.g. 0.40"
          type="number"
        />
        <TextField
          label="Expected Lifetime (Years)"
          value={data.expectedLifetime}
          onChange={(v) => onChange({ expectedLifetime: v })}
          placeholder="e.g. 30"
          type="number"
        />
      </div>
    </div>
  );
}

function StepComposition({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  const addItem = useCallback(() => {
    onChange({
      bom: [
        ...data.bom,
        {
          id: generateId(),
          materialName: "",
          componentType: "",
          massGrams: 0,
          massPercent: 0,
          casNumber: "",
          isCriticalRaw: false,
          isSubstanceOfConcern: false,
        },
      ],
    });
  }, [data.bom, onChange]);

  const loadTemplate = useCallback(() => {
    onChange({
      bom: TEMPLATE_BOM.map((item) => ({ ...item, id: generateId() })),
    });
  }, [onChange]);

  const removeItem = useCallback(
    (id: string) => {
      onChange({ bom: data.bom.filter((b) => b.id !== id) });
    },
    [data.bom, onChange]
  );

  const updateItem = useCallback(
    (id: string, patch: Partial<BomItem>) => {
      onChange({
        bom: data.bom.map((b) => (b.id === id ? { ...b, ...patch } : b)),
      });
    },
    [data.bom, onChange]
  );

  const totalMass = data.bom.reduce((sum, b) => sum + b.massGrams, 0);
  const totalPercent = data.bom.reduce((sum, b) => sum + b.massPercent, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Bill of Materials for this module.{" "}
          {data.bom.length > 0 && (
            <span className="font-mono text-xs">
              {data.bom.length} items, {(totalMass / 1000).toFixed(1)} kg total, {totalPercent.toFixed(1)}%
            </span>
          )}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadTemplate}
            className="cta-secondary !px-3 !py-1.5 !text-xs"
          >
            <span className="flex items-center gap-1">
              <FileDown className="h-3 w-3" /> Load TOPCon Template
            </span>
          </button>
          <button
            type="button"
            onClick={addItem}
            className="cta-primary !px-3 !py-1.5 !text-xs"
          >
            <Plus className="h-3 w-3" /> Add Material
          </button>
        </div>
      </div>

      {data.bom.length === 0 ? (
        <div className="dashed-card flex flex-col items-center py-10 text-center">
          <Layers className="h-8 w-8 text-border" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            No materials added
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Click &quot;Load TOPCon Template&quot; for a standard BOM or add materials manually.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Table header (desktop) */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_0.7fr_0.5fr_0.4fr_0.6fr_auto_auto_2.5rem] gap-2 px-3 py-1.5 bg-muted border border-border">
            <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">Material</span>
            <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">Component</span>
            <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">Mass (g)</span>
            <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">Mass %</span>
            <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">CAS No.</span>
            <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">CRM</span>
            <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">SoC</span>
            <span />
          </div>
          {data.bom.map((item) => (
            <div
              key={item.id}
              className="clean-card p-3"
            >
              {/* Desktop row */}
              <div className="hidden lg:grid lg:grid-cols-[1fr_0.7fr_0.5fr_0.4fr_0.6fr_auto_auto_2.5rem] gap-2 items-center">
                <input
                  value={item.materialName}
                  onChange={(e) => updateItem(item.id, { materialName: e.target.value })}
                  placeholder="Material name"
                  className="w-full border border-border bg-background px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
                />
                <input
                  value={item.componentType}
                  onChange={(e) => updateItem(item.id, { componentType: e.target.value })}
                  placeholder="Component"
                  className="w-full border border-border bg-background px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
                />
                <input
                  type="number"
                  value={item.massGrams || ""}
                  onChange={(e) => updateItem(item.id, { massGrams: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full border border-border bg-background px-2 py-1.5 text-sm font-mono focus:border-primary focus:outline-none"
                />
                <input
                  type="number"
                  value={item.massPercent || ""}
                  onChange={(e) => updateItem(item.id, { massPercent: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full border border-border bg-background px-2 py-1.5 text-sm font-mono focus:border-primary focus:outline-none"
                />
                <input
                  value={item.casNumber}
                  onChange={(e) => updateItem(item.id, { casNumber: e.target.value })}
                  placeholder="e.g. 7440-21-3"
                  className="w-full border border-border bg-background px-2 py-1.5 text-xs font-mono focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => updateItem(item.id, { isCriticalRaw: !item.isCriticalRaw })}
                  className={cn(
                    "h-7 w-7 flex items-center justify-center border text-xs font-bold",
                    item.isCriticalRaw
                      ? "border-primary bg-[var(--passport-green-muted)] text-primary"
                      : "border-border bg-background text-muted-foreground"
                  )}
                  title="Critical Raw Material"
                >
                  C
                </button>
                <button
                  type="button"
                  onClick={() => updateItem(item.id, { isSubstanceOfConcern: !item.isSubstanceOfConcern })}
                  className={cn(
                    "h-7 w-7 flex items-center justify-center border text-xs font-bold",
                    item.isSubstanceOfConcern
                      ? "border-[#F59E0B] bg-[var(--passport-amber-muted)] text-[#F59E0B]"
                      : "border-border bg-background text-muted-foreground"
                  )}
                  title="Substance of Concern"
                >
                  S
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-red-500"
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Mobile layout */}
              <div className="space-y-2 lg:hidden">
                <div className="flex items-center justify-between">
                  <input
                    value={item.materialName}
                    onChange={(e) => updateItem(item.id, { materialName: e.target.value })}
                    placeholder="Material name"
                    className="flex-1 border border-border bg-background px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={item.componentType}
                    onChange={(e) => updateItem(item.id, { componentType: e.target.value })}
                    placeholder="Component type"
                    className="w-full border border-border bg-background px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
                  />
                  <input
                    value={item.casNumber}
                    onChange={(e) => updateItem(item.id, { casNumber: e.target.value })}
                    placeholder="CAS No."
                    className="w-full border border-border bg-background px-2 py-1.5 text-xs font-mono focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={item.massGrams || ""}
                      onChange={(e) => updateItem(item.id, { massGrams: Number(e.target.value) })}
                      placeholder="Mass (g)"
                      className="w-full border border-border bg-background px-2 py-1.5 text-sm font-mono focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={item.massPercent || ""}
                      onChange={(e) => updateItem(item.id, { massPercent: Number(e.target.value) })}
                      placeholder="Mass %"
                      className="w-full border border-border bg-background px-2 py-1.5 text-sm font-mono focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateItem(item.id, { isCriticalRaw: !item.isCriticalRaw })}
                    className={cn(
                      "flex-1 py-1 border text-xs font-semibold",
                      item.isCriticalRaw
                        ? "border-primary bg-[var(--passport-green-muted)] text-foreground"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    Critical Raw Material
                  </button>
                  <button
                    type="button"
                    onClick={() => updateItem(item.id, { isSubstanceOfConcern: !item.isSubstanceOfConcern })}
                    className={cn(
                      "flex-1 py-1 border text-xs font-semibold",
                      item.isSubstanceOfConcern
                        ? "border-[#F59E0B] bg-[var(--passport-amber-muted)] text-foreground"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    Substance of Concern
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Total row */}
          <div className="flex items-center justify-between border-t border-dashed border-border px-3 pt-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total
            </span>
            <div className="flex gap-6 text-sm font-semibold text-foreground">
              <span className="font-mono">{(totalMass / 1000).toFixed(2)} kg</span>
              <span className={cn("font-mono", Math.abs(totalPercent - 100) > 0.5 && "text-[#F59E0B]")}>
                {totalPercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepCompliance({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  const addCert = useCallback(() => {
    onChange({
      certificates: [
        ...data.certificates,
        {
          id: generateId(),
          standard: "",
          certificateNumber: "",
          issuer: "",
          issuedDate: "",
          expiryDate: "",
          status: "valid",
          documentUrl: "",
          scopeNotes: "",
        },
      ],
    });
  }, [data.certificates, onChange]);

  const removeCert = useCallback(
    (id: string) => {
      onChange({ certificates: data.certificates.filter((c) => c.id !== id) });
    },
    [data.certificates, onChange]
  );

  const updateCert = useCallback(
    (id: string, patch: Partial<Certificate>) => {
      onChange({
        certificates: data.certificates.map((c) =>
          c.id === id ? { ...c, ...patch } : c
        ),
      });
    },
    [data.certificates, onChange]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Certifications and compliance documentation.{" "}
          {data.certificates.length > 0 && (
            <span className="font-mono text-xs">
              {data.certificates.length} certificate{data.certificates.length !== 1 ? "s" : ""}
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={addCert}
          className="cta-primary !px-3 !py-1.5 !text-xs"
        >
          <Plus className="h-3 w-3" /> Add Certificate
        </button>
      </div>

      {data.certificates.length === 0 ? (
        <div className="dashed-card flex flex-col items-center py-10 text-center">
          <ShieldCheck className="h-8 w-8 text-border" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            No certificates added
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add IEC, UL, BIS, or CE certificates for this module.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.certificates.map((cert, idx) => (
            <div key={cert.id} className="clean-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Certificate {idx + 1}
                </span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={cert.status || "valid"} className="text-[0.6875rem]" />
                  <button
                    type="button"
                    onClick={() => removeCert(cert.id)}
                    className="flex h-6 w-6 items-center justify-center text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <FieldLabel label="Standard" required />
                  <select
                    value={cert.standard}
                    onChange={(e) => updateCert(cert.id, { standard: e.target.value })}
                    className={cn(
                      "mt-1 block w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
                      !cert.standard && "text-muted-foreground"
                    )}
                  >
                    <option value="">Select standard...</option>
                    {CERTIFICATE_STANDARDS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel label="Certificate Number" />
                  <input
                    value={cert.certificateNumber}
                    onChange={(e) => updateCert(cert.id, { certificateNumber: e.target.value })}
                    placeholder="e.g. IEC-2025-44781"
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <FieldLabel label="Issuer" />
                  <input
                    value={cert.issuer}
                    onChange={(e) => updateCert(cert.id, { issuer: e.target.value })}
                    placeholder="e.g. TUV Rheinland"
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <FieldLabel label="Issued Date" />
                  <input
                    type="date"
                    value={cert.issuedDate}
                    onChange={(e) => updateCert(cert.id, { issuedDate: e.target.value })}
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <FieldLabel label="Expiry Date" />
                  <input
                    type="date"
                    value={cert.expiryDate}
                    onChange={(e) => updateCert(cert.id, { expiryDate: e.target.value })}
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <FieldLabel label="Status" />
                  <select
                    value={cert.status}
                    onChange={(e) => updateCert(cert.id, { status: e.target.value })}
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {CERT_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Document URL</label>
                  <input
                    type="url"
                    value={cert.documentUrl}
                    onChange={(e) => updateCert(cert.id, { documentUrl: e.target.value })}
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Scope Notes</label>
                  <input
                    type="text"
                    value={cert.scopeNotes}
                    onChange={(e) => updateCert(cert.id, { scopeNotes: e.target.value })}
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="e.g. Terrestrial PV modules — Design qualification"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepCircularity({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  return (
    <div className="space-y-5">
      <SectionDivider label="Recyclability & Content" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TextField
          label="Recyclability Rate (%)"
          value={data.recyclabilityRate}
          onChange={(v) => onChange({ recyclabilityRate: v })}
          placeholder="e.g. 92.5"
          type="number"
        />
        <TextField
          label="Recycled Content (%)"
          value={data.recycledContent}
          onChange={(v) => onChange({ recycledContent: v })}
          placeholder="e.g. 15.0"
          type="number"
        />
        <TextField
          label="Renewable Content (%)"
          value={data.renewableContent}
          onChange={(v) => onChange({ renewableContent: v })}
          placeholder="e.g. 0"
          type="number"
        />
      </div>

      <SectionDivider label="Hazardous Substances" />
      <div className="space-y-3">
        <ToggleField
          label="Contains Hazardous Substances"
          checked={data.isHazardous}
          onChange={(v) => onChange({ isHazardous: v })}
          description="As defined under EU REACH / RoHS directives"
        />
        {data.isHazardous && (
          <TextArea
            label="Hazardous Notes"
            value={data.hazardousNotes}
            onChange={(v) => onChange({ hazardousNotes: v })}
            placeholder="Describe hazardous substances, concentrations, and applicable regulations..."
          />
        )}
      </div>

      <SectionDivider label="Dismantling & Repair" />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Dismantling Time (minutes)"
          value={data.dismantlingTime}
          onChange={(v) => onChange({ dismantlingTime: v })}
          placeholder="e.g. 25"
          type="number"
        />
        <TextField
          label="Collection Scheme"
          value={data.collectionScheme}
          onChange={(v) => onChange({ collectionScheme: v })}
          placeholder="e.g. WEEE Directive"
        />
      </div>
      <TextArea
        label="Dismantling Instructions"
        value={data.dismantlingInstructions}
        onChange={(v) => onChange({ dismantlingInstructions: v })}
        placeholder="Step-by-step dismantling procedure for end-of-life recovery..."
        rows={4}
      />

      <SectionDivider label="Recycler Information" />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Recycler Name"
          value={data.recyclerName}
          onChange={(v) => onChange({ recyclerName: v })}
          placeholder="e.g. Veolia Environmental Services"
        />
        <TextField
          label="Recycler Contact"
          value={data.recyclerContact}
          onChange={(v) => onChange({ recyclerContact: v })}
          placeholder="Email or phone"
        />
      </div>

      <SectionDivider label="Material Recovery" />
      <p className="text-xs text-muted-foreground">
        Select materials that can be recovered from this module at end of life.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ToggleField
          label="Aluminium Recovery"
          checked={data.recoveryAluminium}
          onChange={(v) => onChange({ recoveryAluminium: v })}
        />
        <ToggleField
          label="Glass Recovery"
          checked={data.recoveryGlass}
          onChange={(v) => onChange({ recoveryGlass: v })}
        />
        <ToggleField
          label="Silicon Recovery"
          checked={data.recoverySilicon}
          onChange={(v) => onChange({ recoverySilicon: v })}
        />
        <ToggleField
          label="Copper Recovery"
          checked={data.recoveryCopper}
          onChange={(v) => onChange({ recoveryCopper: v })}
        />
        <ToggleField
          label="Silver Recovery"
          checked={data.recoverySilver}
          onChange={(v) => onChange({ recoverySilver: v })}
        />
      </div>
      <TextArea
        label="Recovery Notes"
        value={data.recoveryNotes}
        onChange={(v) => onChange({ recoveryNotes: v })}
        placeholder="Additional recovery process details..."
        rows={2}
      />

      <SectionDivider label="End-of-Life Status" />
      <SelectField
        label="Current Status"
        value={data.eolStatus}
        onChange={(v) => onChange({ eolStatus: v })}
        options={[
          { value: "in_service", label: "In Service" },
          { value: "awaiting_collection", label: "Awaiting Collection" },
          { value: "collected", label: "Collected" },
          { value: "being_recycled", label: "Being Recycled" },
          { value: "recycled", label: "Recycled" },
          { value: "landfill", label: "Landfill" },
        ]}
      />

      <SectionDivider label="REACH / RoHS Compliance" />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="REACH Compliance Status"
          value={data.reachStatus}
          onChange={(v) => onChange({ reachStatus: v })}
          options={[
            { value: "compliant", label: "Compliant" },
            { value: "non_compliant", label: "Non-Compliant" },
            { value: "exempt", label: "Exempt" },
            { value: "under_review", label: "Under Review" },
          ]}
        />
        <SelectField
          label="RoHS Compliance Status"
          value={data.rohsStatus}
          onChange={(v) => onChange({ rohsStatus: v })}
          options={[
            { value: "compliant", label: "Compliant" },
            { value: "compliant_with_exemption", label: "Compliant with Exemption" },
            { value: "exempt", label: "Exempt" },
            { value: "non_compliant", label: "Non-Compliant" },
          ]}
        />
      </div>
    </div>
  );
}

/* ── Step: Carbon & Environmental ── */

function StepCarbon({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  return (
    <div className="space-y-5">
      <SectionDivider label="Carbon Footprint" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TextField
          label="Carbon Footprint Total (kg CO2e)"
          value={data.carbonFootprint}
          onChange={(v) => onChange({ carbonFootprint: v })}
          placeholder="e.g. 850"
          type="number"
        />
        <TextField
          label="Carbon Intensity (gCO2e/kWh)"
          value={data.carbonIntensity}
          onChange={(v) => onChange({ carbonIntensity: v })}
          placeholder="e.g. 22.5"
          type="number"
        />
        <SelectField
          label="LCA Boundary"
          value={data.carbonLcaBoundary}
          onChange={(v) => onChange({ carbonLcaBoundary: v })}
          options={[
            { value: "cradle_to_gate", label: "Cradle-to-Gate" },
            { value: "cradle_to_grave", label: "Cradle-to-Grave" },
          ]}
        />
        <SelectField
          label="Methodology"
          value={data.carbonMethodology}
          onChange={(v) => onChange({ carbonMethodology: v })}
          options={[
            { value: "JRC_harmonized_2025", label: "JRC Harmonized 2025" },
            { value: "PEF", label: "PEF" },
            { value: "ISO_14040", label: "ISO 14040" },
          ]}
        />
        <TextField
          label="Verification Reference (EPD ID)"
          value={data.carbonVerificationRef}
          onChange={(v) => onChange({ carbonVerificationRef: v })}
          placeholder="e.g. EPD-WRM-2025-001"
          mono
        />
      </div>
    </div>
  );
}

/* ── Step: Documents ── */

const DOCUMENT_TYPES = [
  { value: "declaration_of_conformity", label: "Declaration of Conformity" },
  { value: "test_report", label: "Test Report" },
  { value: "user_manual", label: "User Manual" },
  { value: "installation_instructions", label: "Installation Instructions" },
  { value: "safety_instructions", label: "Safety Instructions" },
  { value: "datasheet", label: "Datasheet" },
  { value: "epd", label: "Environmental Product Declaration" },
  { value: "due_diligence_report", label: "Due Diligence Report" },
  { value: "recycling_guide", label: "Recycling Guide" },
  { value: "other", label: "Other" },
];

const ACCESS_LEVELS = [
  { value: "public", label: "Public" },
  { value: "restricted", label: "Restricted" },
  { value: "recycler", label: "Recycler" },
  { value: "authority", label: "Authority" },
  { value: "internal", label: "Internal" },
];

function StepDocuments({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  const addDocument = useCallback(() => {
    onChange({
      documents: [
        ...data.documents,
        { name: "", documentType: "other", accessLevel: "public", url: "", issuer: "", issuedDate: "" },
      ],
    });
  }, [data.documents, onChange]);

  const removeDocument = useCallback(
    (idx: number) => {
      onChange({ documents: data.documents.filter((_, i) => i !== idx) });
    },
    [data.documents, onChange]
  );

  const updateDocument = useCallback(
    (idx: number, patch: Partial<FormData["documents"][number]>) => {
      onChange({
        documents: data.documents.map((d, i) => (i === idx ? { ...d, ...patch } : d)),
      });
    },
    [data.documents, onChange]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Attach documents to this passport.{" "}
          {data.documents.length > 0 && (
            <span className="font-mono text-xs">
              {data.documents.length} document{data.documents.length !== 1 ? "s" : ""}
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={addDocument}
          className="cta-primary !px-3 !py-1.5 !text-xs"
        >
          <Plus className="h-3 w-3" /> Add Document
        </button>
      </div>

      {data.documents.length === 0 ? (
        <div className="dashed-card flex flex-col items-center py-10 text-center">
          <FileText className="h-8 w-8 text-border" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            No documents added
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add datasheets, declarations of conformity, EPDs, and other documents.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.documents.map((doc, idx) => (
            <div key={idx} className="clean-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Document {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeDocument(idx)}
                  className="flex h-6 w-6 items-center justify-center text-muted-foreground hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <FieldLabel label="Document Name" required />
                  <input
                    value={doc.name}
                    onChange={(e) => updateDocument(idx, { name: e.target.value })}
                    placeholder="e.g. Datasheet"
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <FieldLabel label="Document Type" required />
                  <select
                    value={doc.documentType}
                    onChange={(e) => updateDocument(idx, { documentType: e.target.value })}
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {DOCUMENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel label="Access Level" />
                  <select
                    value={doc.accessLevel}
                    onChange={(e) => updateDocument(idx, { accessLevel: e.target.value })}
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {ACCESS_LEVELS.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel label="URL (optional)" />
                  <input
                    value={doc.url}
                    onChange={(e) => updateDocument(idx, { url: e.target.value })}
                    placeholder="https://..."
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <FieldLabel label="Issuer" />
                  <input
                    value={doc.issuer}
                    onChange={(e) => updateDocument(idx, { issuer: e.target.value })}
                    placeholder="e.g. Roshan"
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <FieldLabel label="Issued Date" />
                  <input
                    type="date"
                    value={doc.issuedDate}
                    onChange={(e) => updateDocument(idx, { issuedDate: e.target.value })}
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepSupplyChain({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  const addActor = () => {
    onChange({
      supplyChainActors: [
        ...data.supplyChainActors,
        { id: generateId(), actorName: "", actorRole: "", country: "", facilityName: "", tierLevel: "1", uflpaCompliant: true },
      ],
    });
  };

  const removeActor = (id: string) => {
    onChange({ supplyChainActors: data.supplyChainActors.filter((a) => a.id !== id) });
  };

  const updateActor = (id: string, patch: Partial<SupplyChainActor>) => {
    onChange({
      supplyChainActors: data.supplyChainActors.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    });
  };

  const ACTOR_ROLES = [
    "Polysilicon Supplier",
    "Wafer Manufacturer",
    "Cell Manufacturer",
    "Cell & Module Manufacturer",
    "Module Assembler",
    "Glass Supplier",
    "Frame Supplier",
    "Encapsulant Supplier",
    "Logistics Provider",
    "Distributor",
    "Installer",
    "Other",
  ];

  return (
    <div className="space-y-5">
      <SectionDivider label="Supply Chain Actors" />

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {data.supplyChainActors.length} actor{data.supplyChainActors.length !== 1 ? "s" : ""} added
        </p>
        <button type="button" onClick={addActor} className="cta-secondary text-xs">
          <Plus className="h-3 w-3" /> Add Actor
        </button>
      </div>

      {data.supplyChainActors.length > 0 && (
        <div className="space-y-3">
          {data.supplyChainActors.map((actor, idx) => (
            <div key={actor.id} className="clean-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">
                  Tier {actor.tierLevel} — Actor {idx + 1}
                </span>
                <button type="button" onClick={() => removeActor(actor.id)} className="text-muted-foreground hover:text-red-500">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Actor Name</label>
                  <input
                    type="text"
                    value={actor.actorName}
                    onChange={(e) => updateActor(actor.id, { actorName: e.target.value })}
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="e.g. Tongwei Co., Ltd."
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Role</label>
                  <select
                    value={actor.actorRole}
                    onChange={(e) => updateActor(actor.id, { actorRole: e.target.value })}
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="">Select role...</option>
                    {ACTOR_ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Country</label>
                  <input
                    type="text"
                    value={actor.country}
                    onChange={(e) => updateActor(actor.id, { country: e.target.value })}
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="e.g. China"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Facility Name</label>
                  <input
                    type="text"
                    value={actor.facilityName}
                    onChange={(e) => updateActor(actor.id, { facilityName: e.target.value })}
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="e.g. Leshan Facility"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Tier Level</label>
                  <select
                    value={actor.tierLevel}
                    onChange={(e) => updateActor(actor.id, { tierLevel: e.target.value })}
                    className="mt-1 block w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    {["1", "2", "3", "4", "5"].map((t) => (
                      <option key={t} value={t}>Tier {t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm">
                    <button
                      type="button"
                      onClick={() => updateActor(actor.id, { uflpaCompliant: !actor.uflpaCompliant })}
                      className={cn(
                        "flex h-5 w-5 items-center justify-center border text-xs font-bold",
                        actor.uflpaCompliant
                          ? "border-primary bg-[var(--passport-green-muted)] text-primary"
                          : "border-border bg-background text-transparent"
                      )}
                    >
                      ✓
                    </button>
                    <span className="text-xs text-muted-foreground">UFLPA Compliant</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepReview({
  data,
  onJumpTo,
}: {
  data: FormData;
  onJumpTo: (step: number) => void;
}) {
  const techLabel = TECHNOLOGIES.find((t) => t.value === data.technology)?.label ?? data.technology;
  const facilityLabel = FACILITIES.find((f) => f.id === data.facility)?.label ?? data.facility;
  const modelLabel = MODULE_MODELS.find((m) => m.id === data.modelId)?.label ?? data.modelId;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-[var(--passport-green-muted)] px-4 py-3 text-sm">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <span className="text-foreground">
          Review your passport data before submitting.
        </span>
      </div>

      {/* Section: Identity */}
      <ReviewSection title="Product Identity" onEdit={() => onJumpTo(0)}>
        <ReviewRow label="Passport ID" value={data.passportId} mono />
        <ReviewRow label="Public ID" value={data.publicId} mono />
        <ReviewRow label="Module Model" value={modelLabel} />
        <ReviewRow label="Serial Number" value={data.serialNumber} mono />
        <ReviewRow label="Batch ID" value={data.batchId} mono />
        <ReviewRow label="GTIN" value={data.gtin} mono />
        <ReviewRow label="Manufacturer" value={data.manufacturer} />
        {data.manufacturerOperatorId && <ReviewRow label="Operator ID" value={data.manufacturerOperatorId} mono />}
        {data.manufacturerCountry && <ReviewRow label="Country" value={data.manufacturerCountry} />}
        {data.manufacturerAddress && <ReviewRow label="Address" value={data.manufacturerAddress} />}
        {data.manufacturerContactUrl && <ReviewRow label="Contact URL" value={data.manufacturerContactUrl} />}
        <ReviewRow label="Facility" value={facilityLabel} />
        {data.facilityCountry && <ReviewRow label="Facility Country" value={data.facilityCountry} />}
        <ReviewRow label="Manufacturing Date" value={data.manufacturingDate} />
        <ReviewRow label="Technology" value={techLabel} />
        {data.importerName && <ReviewRow label="Importer" value={data.importerName} />}
        {data.importerOperatorId && <ReviewRow label="Importer Operator ID" value={data.importerOperatorId} mono />}
        {data.importerCountry && <ReviewRow label="Importer Country" value={data.importerCountry} />}
      </ReviewSection>

      {/* Section: Specs */}
      <ReviewSection title="Technical Specifications" onEdit={() => onJumpTo(1)}>
        <ReviewRow label="Rated Power" value={data.ratedPower ? `${data.ratedPower} W` : ""} highlight />
        <ReviewRow label="Efficiency" value={data.efficiency ? `${data.efficiency}%` : ""} highlight />
        <ReviewRow label="Voc" value={data.voc ? `${data.voc} V` : ""} />
        <ReviewRow label="Isc" value={data.isc ? `${data.isc} A` : ""} />
        <ReviewRow label="Vmp" value={data.vmp ? `${data.vmp} V` : ""} />
        <ReviewRow label="Imp" value={data.imp ? `${data.imp} A` : ""} />
        <ReviewRow label="Max System Voltage" value={data.maxSystemVoltage ? `${data.maxSystemVoltage} V` : ""} />
        <ReviewRow label="Dimensions" value={data.length && data.width && data.depth ? `${data.length} x ${data.width} x ${data.depth} mm` : ""} />
        <ReviewRow label="Mass" value={data.mass ? `${data.mass} kg` : ""} />
        <ReviewRow label="Cell Count" value={data.cellCount} />
        <ReviewRow label="Cell Type" value={data.cellType} />
        <ReviewRow label="Frame" value={data.frameType} />
        <ReviewRow label="Glass" value={data.glassType} />
        <ReviewRow label="Bifaciality" value={data.bifacialityFactor} />
        <ReviewRow label="Fire Rating" value={data.fireRating} />
        <ReviewRow label="IP Rating" value={data.ipRating} />
        <ReviewRow label="Connector" value={data.connectorType} />
        <ReviewRow label="Warranty" value={data.warrantyYears ? `${data.warrantyYears} years` : ""} />
        <ReviewRow label="Performance Warranty" value={data.performanceWarranty ? `${data.performanceWarranty}%` : ""} />
        <ReviewRow label="Degradation" value={data.degradationRate ? `${data.degradationRate}%/yr` : ""} />
        <ReviewRow label="Expected Lifetime" value={data.expectedLifetime ? `${data.expectedLifetime} years` : ""} />
      </ReviewSection>

      {/* Section: Composition */}
      <ReviewSection title="Material Composition" onEdit={() => onJumpTo(2)}>
        {data.bom.length === 0 ? (
          <p className="px-4 py-3 text-sm text-muted-foreground italic">No materials added</p>
        ) : (
          <div>
            <div className="hidden sm:grid sm:grid-cols-[1fr_0.7fr_0.5fr_0.3fr] gap-2 px-4 py-2 bg-muted border-b border-border">
              <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">Material</span>
              <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">Component</span>
              <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">Mass</span>
              <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted-foreground">Flags</span>
            </div>
            {data.bom.map((b) => (
              <div key={b.id} className="grid sm:grid-cols-[1fr_0.7fr_0.5fr_0.3fr] gap-2 px-4 py-2 border-b border-border last:border-0 text-sm">
                <span className="text-foreground font-medium">{b.materialName || "—"}</span>
                <span className="text-muted-foreground">{b.componentType || "—"}</span>
                <span className="font-mono text-foreground">{b.massGrams}g ({b.massPercent}%)</span>
                <div className="flex gap-1">
                  {b.isCriticalRaw && (
                    <span className="inline-flex items-center px-1.5 py-0.5 text-[0.6rem] font-bold bg-[var(--passport-green-muted)] text-primary">CRM</span>
                  )}
                  {b.isSubstanceOfConcern && (
                    <span className="inline-flex items-center px-1.5 py-0.5 text-[0.6rem] font-bold bg-[var(--passport-amber-muted)] text-[#F59E0B]">SoC</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ReviewSection>

      {/* Section: Compliance */}
      <ReviewSection title="Compliance & Certificates" onEdit={() => onJumpTo(3)}>
        {data.certificates.length === 0 ? (
          <p className="px-4 py-3 text-sm text-muted-foreground italic">No certificates added</p>
        ) : (
          <div className="divide-y divide-border">
            {data.certificates.map((c) => (
              <div key={c.id} className="px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-1">
                <span className="text-sm font-medium text-foreground">{c.standard || "—"}</span>
                {c.certificateNumber && (
                  <span className="font-mono text-xs text-muted-foreground">{c.certificateNumber}</span>
                )}
                {c.issuer && (
                  <span className="text-xs text-muted-foreground">{c.issuer}</span>
                )}
                <StatusBadge status={c.status || "valid"} className="ml-auto text-[0.6875rem]" />
              </div>
            ))}
          </div>
        )}
      </ReviewSection>

      {/* Section: Circularity */}
      <ReviewSection title="Circularity & End-of-Life" onEdit={() => onJumpTo(4)}>
        <ReviewRow label="Recyclability Rate" value={data.recyclabilityRate ? `${data.recyclabilityRate}%` : ""} highlight />
        <ReviewRow label="Recycled Content" value={data.recycledContent ? `${data.recycledContent}%` : ""} />
        <ReviewRow label="Renewable Content" value={data.renewableContent ? `${data.renewableContent}%` : ""} />
        <ReviewRow label="Hazardous" value={data.isHazardous ? "Yes" : "No"} />
        {data.isHazardous && <ReviewRow label="Hazardous Notes" value={data.hazardousNotes} />}
        <ReviewRow label="Dismantling Time" value={data.dismantlingTime ? `${data.dismantlingTime} min` : ""} />
        <ReviewRow label="Collection Scheme" value={data.collectionScheme} />
        <ReviewRow label="Recycler" value={data.recyclerName} />
        <ReviewRow
          label="Recovery"
          value={[
            data.recoveryAluminium && "Al",
            data.recoveryGlass && "Glass",
            data.recoverySilicon && "Si",
            data.recoveryCopper && "Cu",
            data.recoverySilver && "Ag",
          ]
            .filter(Boolean)
            .join(", ")}
        />
        <ReviewRow
          label="EoL Status"
          value={
            {
              in_service: "In Service",
              awaiting_collection: "Awaiting Collection",
              collected: "Collected",
              being_recycled: "Being Recycled",
              recycled: "Recycled",
              landfill: "Landfill",
            }[data.eolStatus] ?? data.eolStatus
          }
        />
        <ReviewRow
          label="REACH Status"
          value={
            { compliant: "Compliant", non_compliant: "Non-Compliant", exempt: "Exempt", under_review: "Under Review" }[data.reachStatus] ?? data.reachStatus
          }
        />
        <ReviewRow
          label="RoHS Status"
          value={
            { compliant: "Compliant", compliant_with_exemption: "Compliant with Exemption", exempt: "Exempt", non_compliant: "Non-Compliant" }[data.rohsStatus] ?? data.rohsStatus
          }
        />
      </ReviewSection>

      {/* Section: Carbon & Environmental */}
      <ReviewSection title="Carbon & Environmental" onEdit={() => onJumpTo(5)}>
        <ReviewRow label="Carbon Footprint" value={data.carbonFootprint ? `${data.carbonFootprint} kg CO2e` : ""} highlight />
        <ReviewRow label="Carbon Intensity" value={data.carbonIntensity ? `${data.carbonIntensity} gCO2e/kWh` : ""} />
        <ReviewRow
          label="LCA Boundary"
          value={
            { cradle_to_gate: "Cradle-to-Gate", cradle_to_grave: "Cradle-to-Grave" }[data.carbonLcaBoundary] ?? data.carbonLcaBoundary
          }
        />
        <ReviewRow
          label="Methodology"
          value={
            { JRC_harmonized_2025: "JRC Harmonized 2025", PEF: "PEF", ISO_14040: "ISO 14040" }[data.carbonMethodology] ?? data.carbonMethodology
          }
        />
        <ReviewRow label="Verification Ref" value={data.carbonVerificationRef} mono />
      </ReviewSection>

      {/* Section: Documents */}
      <ReviewSection title="Documents" onEdit={() => onJumpTo(6)}>
        {data.documents.length === 0 ? (
          <p className="px-4 py-3 text-sm text-muted-foreground italic">No documents added</p>
        ) : (
          <div className="divide-y divide-border">
            {data.documents.map((doc, idx) => (
              <div key={idx} className="px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-1">
                <span className="text-sm font-medium text-foreground">{doc.name || "—"}</span>
                <span className="text-xs text-muted-foreground">
                  {DOCUMENT_TYPES.find((t) => t.value === doc.documentType)?.label ?? doc.documentType}
                </span>
                <span className="text-xs text-muted-foreground">
                  {ACCESS_LEVELS.find((l) => l.value === doc.accessLevel)?.label ?? doc.accessLevel}
                </span>
                {doc.issuer && <span className="text-xs text-muted-foreground">{doc.issuer}</span>}
              </div>
            ))}
          </div>
        )}
      </ReviewSection>

      {/* Section: Supply Chain */}
      <ReviewSection title="Supply Chain" onEdit={() => onJumpTo(7)}>
        {data.supplyChainActors.length === 0 ? (
          <p className="px-4 py-3 text-sm text-muted-foreground italic">No supply chain actors added</p>
        ) : (
          <div className="divide-y divide-border">
            {data.supplyChainActors.map((actor, idx) => (
              <div key={idx} className="px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-1">
                <span className="text-sm font-medium text-foreground">{actor.actorName || "—"}</span>
                <span className="text-xs text-muted-foreground">{actor.actorRole}</span>
                <span className="text-xs text-muted-foreground">Tier {actor.tierLevel}</span>
                {actor.country && <span className="text-xs text-muted-foreground">{actor.country}</span>}
                {actor.uflpaCompliant && (
                  <span className="inline-flex items-center gap-1 text-xs text-primary">
                    <CheckCircle2 className="h-3 w-3" /> UFLPA
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </ReviewSection>
    </div>
  );
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="clean-card overflow-hidden">
      <div className="flex items-center justify-between bg-muted border-b border-border px-4 py-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-foreground"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
}

function ReviewRow({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="passport-table-row">
      <span className="table-label">{label}</span>
      <span
        className={cn(
          "table-value",
          mono && "mono",
          highlight && "highlight"
        )}
      >
        {value || "—"}
      </span>
    </div>
  );
}

/* ============================================
   MAIN WIZARD PAGE
   ============================================ */

export default function CreatePassportPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdPassportId, setCreatedPassportId] = useState<string | null>(null);
  const [createdPvPassportId, setCreatedPvPassportId] = useState<string | null>(null);

  // Generate IDs client-side only to avoid hydration mismatch
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      passportId: prev.passportId || generatePassportId(),
      publicId: prev.publicId || generateUUID(),
    }));
  }, []);

  const step = WIZARD_STEPS[currentStep];

  const completedSteps = useMemo(() => {
    const completed = new Set<number>();
    // Identity complete if model + manufacturer + technology set
    if (formData.modelId && formData.manufacturer && formData.technology)
      completed.add(0);
    // Specs complete if power + efficiency set
    if (formData.ratedPower && formData.efficiency) completed.add(1);
    // Composition complete if BOM has items
    if (formData.bom.length > 0) completed.add(2);
    // Compliance complete if at least one cert
    if (formData.certificates.length > 0) completed.add(3);
    // Circularity complete if recyclability rate set
    if (formData.recyclabilityRate) completed.add(4);
    // Carbon complete if carbonFootprint is set
    if (formData.carbonFootprint) completed.add(5);
    // Documents complete if at least one document
    if (formData.documents.length > 0) completed.add(6);
    // Review is never "complete" by itself
    return completed;
  }, [formData]);

  const handleChange = useCallback((patch: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    setSavedDraft(false);
  }, []);

  const handleNext = useCallback(() => {
    const stepErrors = validateStep(step.id, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, formData, step.id]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setErrors({});
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSaveDraft = useCallback(() => {
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 2500);
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const facilityName =
      FACILITIES.find((f) => f.id === formData.facility)?.label ?? "";

    const result = await createPassport({
      modelId: formData.modelId,
      serialNumber: formData.serialNumber,
      batchId: formData.batchId,
      gtin: formData.gtin,
      manufacturer: formData.manufacturer,
      facility: formData.facility,
      facilityName,
      facilityCountry: formData.facilityCountry,
      manufacturingDate: formData.manufacturingDate,
      technology: formData.technology,
      manufacturerOperatorId: formData.manufacturerOperatorId,
      manufacturerCountry: formData.manufacturerCountry,
      manufacturerAddress: formData.manufacturerAddress,
      manufacturerContactUrl: formData.manufacturerContactUrl,
      importerName: formData.importerName,
      importerOperatorId: formData.importerOperatorId,
      importerCountry: formData.importerCountry,
      ratedPower: formData.ratedPower,
      efficiency: formData.efficiency,
      voc: formData.voc,
      isc: formData.isc,
      vmp: formData.vmp,
      imp: formData.imp,
      maxSystemVoltage: formData.maxSystemVoltage,
      length: formData.length,
      width: formData.width,
      depth: formData.depth,
      mass: formData.mass,
      cellCount: formData.cellCount,
      cellType: formData.cellType,
      tempCoeffPmax: formData.tempCoeffPmax,
      tempCoeffVoc: formData.tempCoeffVoc,
      tempCoeffIsc: formData.tempCoeffIsc,
      noct: formData.noct,
      fireRating: formData.fireRating,
      ipRating: formData.ipRating,
      connectorType: formData.connectorType,
      frameType: formData.frameType,
      glassType: formData.glassType,
      bifacialityFactor: formData.bifacialityFactor,
      warrantyYears: formData.warrantyYears,
      performanceWarranty: formData.performanceWarranty,
      degradationRate: formData.degradationRate,
      expectedLifetime: formData.expectedLifetime,
      carbonFootprint: formData.carbonFootprint,
      carbonIntensity: formData.carbonIntensity,
      carbonLcaBoundary: formData.carbonLcaBoundary,
      carbonMethodology: formData.carbonMethodology,
      carbonVerificationRef: formData.carbonVerificationRef,
      reachStatus: formData.reachStatus,
      rohsStatus: formData.rohsStatus,
      recyclabilityRate: formData.recyclabilityRate,
      recycledContent: formData.recycledContent,
      renewableContent: formData.renewableContent,
      isHazardous: formData.isHazardous,
      hazardousNotes: formData.hazardousNotes,
      dismantlingTime: formData.dismantlingTime,
      dismantlingInstructions: formData.dismantlingInstructions,
      collectionScheme: formData.collectionScheme,
      recyclerName: formData.recyclerName,
      recyclerContact: formData.recyclerContact,
      recoveryAluminium: formData.recoveryAluminium,
      recoveryGlass: formData.recoveryGlass,
      recoverySilicon: formData.recoverySilicon,
      recoveryCopper: formData.recoveryCopper,
      recoverySilver: formData.recoverySilver,
      recoveryNotes: formData.recoveryNotes,
      eolStatus: formData.eolStatus,
      bom: formData.bom.map((b) => ({
        materialName: b.materialName,
        componentType: b.componentType,
        massGrams: b.massGrams,
        massPercent: b.massPercent,
        casNumber: b.casNumber,
        isCriticalRaw: b.isCriticalRaw,
        isSubstanceOfConcern: b.isSubstanceOfConcern,
      })),
      certificates: formData.certificates.map((c) => ({
        standard: c.standard,
        certificateNumber: c.certificateNumber,
        issuer: c.issuer,
        issuedDate: c.issuedDate,
        expiryDate: c.expiryDate,
        status: c.status,
        documentUrl: c.documentUrl,
        scopeNotes: c.scopeNotes,
      })),
      documents: formData.documents.map((d) => ({
        name: d.name,
        documentType: d.documentType,
        accessLevel: d.accessLevel,
        url: d.url,
        issuer: d.issuer,
        issuedDate: d.issuedDate,
      })),
      supplyChainActors: formData.supplyChainActors.map((a) => ({
        actorName: a.actorName,
        actorRole: a.actorRole,
        country: a.country,
        facilityName: a.facilityName,
        tierLevel: a.tierLevel,
        uflpaCompliant: a.uflpaCompliant,
      })),
    });

    if (result.success) {
      setCreatedPassportId(result.passportId);
      setCreatedPvPassportId(result.pvPassportId);
      setSubmitted(true);
    } else {
      setSubmitError(result.error);
    }
    setIsSubmitting(false);
  }, [formData]);

  const handleJumpTo = useCallback((idx: number) => {
    setErrors({});
    setCurrentStep(idx);
  }, []);

  if (submitted) {
    return (
      <div className="space-y-6">
        <div>
          <Link
            href="/app/passports"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Passports
          </Link>
        </div>
        <div className="clean-card flex flex-col items-center py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center bg-[var(--passport-green-muted)]">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-foreground">
            Passport Submitted for Approval
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Passport{" "}
            <span className="font-mono font-semibold text-foreground">
              {createdPvPassportId ?? formData.passportId}
            </span>{" "}
            has been saved and submitted. It will be reviewed by your compliance team
            before publication.
          </p>
          <div className="mt-6 flex gap-3">
            {createdPassportId && (
              <Link href={`/app/passports/${createdPassportId}`} className="cta-secondary !text-sm">
                <span>View Passport</span>
              </Link>
            )}
            <Link href="/app/passports" className="cta-secondary !text-sm">
              <span>View All Passports</span>
            </Link>
            <button
              onClick={() => {
                setFormData(initialFormData());
                setCurrentStep(0);
                setSubmitted(false);
                setCreatedPassportId(null);
                setCreatedPvPassportId(null);
              }}
              className="cta-primary !text-sm"
            >
              Create Another <ArrowRight className="h-3.5 w-3.5 arrow-icon" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/app/passports"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Passports
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Create Passport
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              <span className="font-mono">{formData.passportId}</span>
            </p>
          </div>
          {savedDraft && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
              <CheckCircle2 className="h-3 w-3" /> Draft saved
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left stepper (desktop) */}
        <nav className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-20 space-y-0.5">
            {WIZARD_STEPS.map((s, i) => {
              const isCompleted = completedSteps.has(i);
              const isCurrent = i === currentStep;
              return (
                <button
                  key={s.id}
                  onClick={() => handleJumpTo(i)}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors",
                    isCurrent
                      ? "border-l-2 border-primary bg-[var(--passport-green-muted)] font-medium text-foreground"
                      : isCompleted
                        ? "border-l-2 border-primary/40 text-foreground"
                        : "border-l-2 border-transparent text-muted-foreground hover:bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center text-[0.65rem] font-bold",
                      isCurrent
                        ? "bg-primary text-white"
                        : isCompleted
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted && !isCurrent ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main form area */}
        <div className="min-w-0 flex-1">
          {/* Mobile step indicator */}
          <div className="mb-4 lg:hidden">
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {WIZARD_STEPS.map((s, i) => {
                const isCompleted = completedSteps.has(i);
                const isCurrent = i === currentStep;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleJumpTo(i)}
                    className={cn(
                      "flex shrink-0 items-center gap-1 px-2 py-1 text-[0.6875rem] font-medium transition-colors",
                      isCurrent
                        ? "bg-[var(--passport-green-muted)] text-foreground border border-primary"
                        : isCompleted
                          ? "bg-muted text-primary border border-border"
                          : "bg-background text-muted-foreground border border-border"
                    )}
                  >
                    {isCompleted && !isCurrent ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <span>{i + 1}</span>
                    )}
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="clean-card p-6">
            <div className="flex items-center gap-2">
              <step.icon className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-bold text-foreground">{step.label}</h2>
              <span className="ml-auto text-xs text-muted-foreground">
                Step {currentStep + 1} of {WIZARD_STEPS.length}
              </span>
            </div>

            {/* Step content */}
            <div className="mt-6">
              {step.id === "identity" && (
                <StepIdentity
                  data={formData}
                  onChange={handleChange}
                  errors={errors}
                />
              )}
              {step.id === "specs" && (
                <StepSpecs
                  data={formData}
                  onChange={handleChange}
                  errors={errors}
                />
              )}
              {step.id === "composition" && (
                <StepComposition data={formData} onChange={handleChange} />
              )}
              {step.id === "compliance" && (
                <StepCompliance data={formData} onChange={handleChange} />
              )}
              {step.id === "circularity" && (
                <StepCircularity data={formData} onChange={handleChange} />
              )}
              {step.id === "carbon" && (
                <StepCarbon data={formData} onChange={handleChange} />
              )}
              {step.id === "documents" && (
                <StepDocuments data={formData} onChange={handleChange} />
              )}
              {step.id === "supplychain" && (
                <StepSupplyChain data={formData} onChange={handleChange} />
              )}
              {step.id === "review" && (
                <StepReview data={formData} onJumpTo={handleJumpTo} />
              )}
            </div>
          </div>

          {/* Submit error */}
          {submitError && (
            <div className="mt-4 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Footer actions */}
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="cta-secondary !text-xs"
            >
              <span className="flex items-center gap-1">
                <Save className="h-3 w-3" /> Save Draft
              </span>
            </button>
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="cta-secondary !text-xs"
                >
                  <span className="flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" /> Back
                  </span>
                </button>
              )}
              {currentStep < WIZARD_STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="cta-primary !text-xs"
                >
                  Next <ArrowRight className="h-3 w-3 arrow-icon" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="cta-primary !text-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-3 w-3 animate-spin border-2 border-white border-t-transparent rounded-full inline-block" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-3 w-3" /> Submit for Approval
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
