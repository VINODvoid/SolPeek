import { StyleSheet } from "react-native";

export const COLORS = {
  background: "#000000", // The Void
  line: "#222222", // Dark Wireframe
  primary: "#FFFFFF", // Stark White
  muted: "#555555", // Dim Gray
  accent: "#888888", // Technical Silver
  green: "#14F195", // Solana Green
  solana_purple: "#9945FF",
  solana_blue: "#19FBDB",
  red: "#EF4444", // Error Red
  TESTNET_COLOR: "#FFA500"
};

export const s = StyleSheet.create({
  tokenIconImage: {
    width: 22,
    height: 22,
    borderRadius: 11, // Makes it circular
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.line, // Fallback color while loading
  },
  // Update tokenSelector gap for better alignment
  tokenSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  soltext: {
    color: "#14F195",
    fontWeight: "900",
    textShadowColor: "#9945FF", // Purple shadow for a "color bleed" effect
    textShadowOffset: { width: -1, height: 0 },
    textShadowRadius: 14,
  },
  soltextsecond: {
    color: "#14F195",
    fontWeight: "900",
    fontSize: 18,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
    marginBottom: 50,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  // GLOBAL & LAYOUT
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 25,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 80,
    paddingBottom: 40,
  },
  content: {
    // For Swap Screen specifically
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 40,
  },

  // HEADER COMPONENT
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  appname_first: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: "200",
    letterSpacing: 6,
  },
  appname_second: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 6,
    textTransform: "uppercase",
  },

  networkBtn: {
    borderWidth: 1,
    borderColor: COLORS.green, // Border matches the green text
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 0, // Keep it sharp/brutalist
    backgroundColor: "rgba(20, 241, 149, 0.05)", // Very subtle green tint
  },
  networkText: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    fontFamily: "monospace",
  },

  // INPUTS & BUTTONS
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255,255,255,0.02)", // Subtle depth
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 2,
  },
  input: {
    color: COLORS.primary,
    fontSize: 14,
    paddingVertical: 15,
    fontFamily: "monospace",
  },
  btnRow: {
    flexDirection: "row",
    marginTop: -1, // Merges with input/card above
  },
  btn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  btnDisabled: {
    opacity: 0.3,
  },
  btnText: {
    color: COLORS.primary,
    fontWeight: "400",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 4,
  },

  // CARDS (SCAN & SWAP)
  card: {
    // Wallet Balance Card
    marginTop: 60,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 24,
    alignItems: "center",
    position: "relative",
  },
  swapcard: {
    // Swap Input Card
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 20,
    paddingTop: 30,
    position: "relative",
  },
  label: {
    position: "absolute",
    top: -10,
    left: 20,
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    color: "white",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 2,
  },

  // SWAP SPECIFIC UI
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  tokenIcon: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  tokenIconText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  tokenName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 1,
  },
  amountInput: {
    fontSize: 32,
    fontWeight: "200",
    color: COLORS.primary,
    textAlign: "right",
    flex: 1,
    fontFamily: "monospace",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    paddingTop: 10,
  },
  balanceText: {
    fontSize: 10,
    color: COLORS.muted,
    fontFamily: "monospace",
  },
  usdText: {
    fontSize: 10,
    color: COLORS.muted,
    fontFamily: "monospace",
  },
  arrowContainer: {
    alignItems: "center",
    marginVertical: -1,
    zIndex: 10,
  },
  swapArrow: {
    backgroundColor: COLORS.background,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.line,
  },

  // LISTS & SCAN RESULTS
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  balance: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: "100", // Thinner weight for a more "luxury" tech feel
    letterSpacing: -1,
  },
  sol: {
    color: COLORS.muted,
    fontSize: 16,
    fontWeight: "300",
    marginLeft: 10,
  },
  addrContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.03)", 
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 2,
    gap: 10,
  },
  solIcon: {
    width: 16,
    height: 16,
    borderRadius: 8, // Makes the Solana logo perfectly circular
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)", // Subtle ring around the logo
  },
  addrText: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: "monospace",
    letterSpacing: 1,
    fontWeight: "600",
  },
  section: {
    color: COLORS.accent, // Use accent color for section titles
    fontSize: 11,
    fontWeight: "900",
    marginTop: 60,
    textTransform: "uppercase",
    letterSpacing: 4,
    paddingLeft: 0, // Align with the left edge for a cleaner line
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    paddingBottom: 10,
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 5, // Less padding looks better with the bottom border
    borderBottomWidth: 1,
    borderColor: COLORS.line,
  },
  mint: {
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  amount: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  time: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 4,
  },
  statusIcon: {
    fontSize: 12,
    color: COLORS.primary,
    opacity: 0.5,
  },
  title: {
    // For Swap Screen title
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 4,
    marginBottom: 40,
  },
  sectionHeader: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 15,
    marginTop: 16,
    textTransform: "uppercase",
  },
  configCard: {
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 20,
    backgroundColor: "transparent",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12, // Increased padding for better touch targets
  },
  settingLabel: {
    color: COLORS.primary,
    fontSize: 13,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  countBadge: {
    color: COLORS.green,
    fontSize: 12,
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  innerDivider: {
    height: 1,
    backgroundColor: COLORS.line,
    marginVertical: 5,
  },
  dangerBtn: {
    borderWidth: 1,
    borderColor: COLORS.red,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 18,
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  dangerBtnText: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: "800",
    fontFamily: "monospace",
    letterSpacing: 2,
  },
  // GHOST BUTTON (SECONDARY ACTION)
  btnGhost: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.line, // Matches the input/card borders
    backgroundColor: "transparent",
    marginLeft: 10, // Adds space between the primary Search button and Clear button
  },
  btnGhostText: {
    color: COLORS.muted, // Dimmed text for secondary action
    fontWeight: "400",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 4,
  },
});
