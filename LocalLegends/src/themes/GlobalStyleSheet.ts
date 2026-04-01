// src/theme/globalStyles.ts
import { StyleSheet } from "react-native";
import { COLORS, SPACING, BORDER_RADIUS } from "./themes";

export const globalStyles = StyleSheet.create({
  // --- LAYOUT ---
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.backgroundPrimary,
  },
  container: {
    padding: SPACING.lg,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.card,
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  // --- TYPOGRAPHY ---
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    textAlign: "center",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginBottom: SPACING.md,
  },

  // --- INPUTS ---
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    width: "100%",
    marginBottom: SPACING.md,
    color: COLORS.text,
  },

  // --- BUTTONS ---
  buttonPrimary: {
    backgroundColor: COLORS.buttonPrimary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    width: "100%",
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  buttonPrimaryText: {
    color: COLORS.buttonText,
    fontWeight: "bold",
    fontSize: 16,
  },

  buttonSecondary: {
    backgroundColor: "transparent",
    paddingVertical: SPACING.md,
    width: "100%",
    alignItems: "center",
  },
  buttonSecondaryText: {
    color: COLORS.buttonTextSecondary,
    fontWeight: "600",
    fontSize: 16,
  },
});