import { StyleSheet } from "@react-pdf/renderer";
import type { BrandConfig } from "../types";

export function createPdfStyles(brand: BrandConfig) {
  return StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
      fontSize: 10,
      padding: 40,
      color: "#1a1a1a",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
      paddingBottom: 12,
      borderBottomWidth: 2,
      borderBottomColor: brand.primaryColor,
    },
    headerTitle: {
      fontSize: 16,
      fontFamily: "Helvetica-Bold",
      color: "#1a1a1a",
    },
    headerSubtitle: {
      fontSize: 8,
      color: "#737373",
      marginTop: 2,
    },
    headerDate: {
      fontSize: 8,
      color: "#737373",
      textAlign: "right",
    },
    sectionTitle: {
      fontSize: 13,
      fontFamily: "Helvetica-Bold",
      color: "#1a1a1a",
      marginTop: 20,
      marginBottom: 8,
      paddingBottom: 4,
      borderBottomWidth: 1,
      borderBottomColor: "#e5e5e5",
    },
    label: {
      fontSize: 8,
      color: "#737373",
      marginBottom: 2,
    },
    value: {
      fontSize: 10,
      color: "#1a1a1a",
    },
    row: {
      flexDirection: "row",
      paddingVertical: 4,
      borderBottomWidth: 0.5,
      borderBottomColor: "#f0f0f0",
    },
    cell: {
      flex: 1,
      fontSize: 9,
      color: "#1a1a1a",
    },
    cellHeader: {
      flex: 1,
      fontSize: 8,
      fontFamily: "Helvetica-Bold",
      color: "#737373",
      textTransform: "uppercase",
    },
    kpiCard: {
      padding: 12,
      marginBottom: 8,
      backgroundColor: "#fafafa",
      borderWidth: 1,
      borderColor: "#e5e5e5",
    },
    kpiValue: {
      fontSize: 20,
      fontFamily: "Helvetica-Bold",
      color: "#1a1a1a",
    },
    kpiLabel: {
      fontSize: 8,
      color: "#737373",
      marginTop: 2,
    },
    badge: {
      fontSize: 7,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 2,
    },
    badgeGreen: {
      backgroundColor: "#dcfce7",
      color: "#16a34a",
    },
    badgeAmber: {
      backgroundColor: "#fef3c7",
      color: "#d97706",
    },
    badgeRed: {
      backgroundColor: "#fee2e2",
      color: "#dc2626",
    },
    footer: {
      position: "absolute",
      bottom: 20,
      left: 40,
      right: 40,
      flexDirection: "row",
      justifyContent: "space-between",
      fontSize: 7,
      color: "#a3a3a3",
      borderTopWidth: 0.5,
      borderTopColor: "#e5e5e5",
      paddingTop: 6,
    },
    grid2: {
      flexDirection: "row",
      gap: 12,
    },
    gridCol: {
      flex: 1,
    },
  });
}
