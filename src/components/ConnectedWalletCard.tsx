import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, s } from "../styles/styles";
import { short } from "../utils";
import { PublicKey } from "@solana/web3.js"; // Import this to type the publicKey

interface ConnectedWalletCardProps {
  wallet: {
    publicKey: PublicKey | null; // Match the actual hook's type
    disconnect: () => void;
  };
}

export const ConnectedWalletCard = ({ wallet }: ConnectedWalletCardProps) => {
  // Convert the PublicKey object to a string safely
  const addressString = wallet.publicKey ? wallet.publicKey.toBase58() : "UNKNOWN";

  return (
    <View style={localStyles.container}>
      {/* LABEL / STATUS INDICATOR */}
      <View style={localStyles.statusHeader}>
        <View style={localStyles.statusBadge}>
          <View style={localStyles.pulseDot} />
          <Text style={localStyles.statusText}>SESSION_ACTIVE</Text>
        </View>
        <Text style={localStyles.networkLabel}>SOLANA_MAINNET</Text>
      </View>

      <View style={localStyles.mainContent}>
        {/* AVATAR / ICON */}
        <View style={localStyles.iconContainer}>
          <Image
            source={{
              uri: "https://api.phantom.app/image-proxy/?image=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fsolana-labs%2Ftoken-list%40main%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png",
            }}
            style={localStyles.solIcon}
          />
        </View>

        {/* ADDRESS INFO */}
        <View style={localStyles.infoContainer}>
          {/* Use the converted string here */}
          <Text style={localStyles.addressText}>{short(addressString, 8)}</Text>
          <Text style={localStyles.subText}>CONNECTED_VIA_ADAPTER</Text>
        </View>

        {/* TERMINATE ACTION */}
        <TouchableOpacity 
          onPress={wallet.disconnect} 
          style={localStyles.disconnectBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="power-sharp" size={18} color={COLORS.red} />
        </TouchableOpacity>
      </View>

      {/* FOOTER DECORATION */}
      <View style={localStyles.footerLines}>
        <View style={[localStyles.line, { flex: 3 }]} />
        <View style={[localStyles.line, { flex: 1, backgroundColor: COLORS.green }]} />
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    padding: 15,
    marginVertical: 20,
    position: "relative",
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(20, 241, 149, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(20, 241, 149, 0.3)",
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.green,
  },
  statusText: {
    color: COLORS.green,
    fontSize: 9,
    fontFamily: "monospace",
    fontWeight: "900",
  },
  networkLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  solIcon: {
    width: 24,
    height: 24,
  },
  infoContainer: {
    flex: 1,
  },
  addressText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: "monospace",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  subText: {
    color: COLORS.muted,
    fontSize: 9,
    fontFamily: "monospace",
    marginTop: 2,
  },
  disconnectBtn: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  footerLines: {
    flexDirection: "row",
    gap: 4,
    marginTop: 15,
    height: 2,
  },
  line: {
    height: "100%",
    backgroundColor: COLORS.line,
  },
});