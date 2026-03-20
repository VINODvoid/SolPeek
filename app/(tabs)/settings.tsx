import React, { useState } from "react";
import {
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useWalletStore } from "../../src/store/wallet-store";
import { s, COLORS } from "../../src/styles/styles";
import { useWallet } from "../../src/hooks/useWallet";
import { ConfirmModal } from "../../src/components/ConfirmModal";
import { short } from "../../src/utils";

export default function SettingsScreen() {
  const router = useRouter();
  const wallet = useWallet();

  // ZUSTAND STORE
  const isDevnet = useWalletStore((s) => s.isDevnet);
  const toggleNetwork = useWalletStore((s) => s.toggleNetwork);
  const favorites = useWalletStore((s) => s.favorites);
  const searchHistory = useWalletStore((s) => s.searchHistory);
  const clearHistory = useWalletStore((s) => s.clearHistory);

  // MODAL STATES
  const [purgeModalVisible, setPurgeModalVisible] = useState(false);
  const [networkModalVisible, setNetworkModalVisible] = useState(false);
  const [disconnectModalVisible, setDisconnectModalVisible] = useState(false);

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      {/* MODALS */}
      <ConfirmModal
        visible={purgeModalVisible}
        title="CONFIRM_PURGE"
        message="DANGER: You are about to clear the search cache. Local address buffers will be flushed."
        onCancel={() => setPurgeModalVisible(false)}
        onConfirm={() => {
          clearHistory();
          setPurgeModalVisible(false);
        }}
      />

      <ConfirmModal
        visible={networkModalVisible}
        title="SWITCH_LAYER"
        message={`WARNING: Migrating system to ${isDevnet ? "MAINNET" : "DEVNET"}. Active RPC connections will be reset.`}
        onCancel={() => setNetworkModalVisible(false)}
        onConfirm={() => {
          toggleNetwork();
          setNetworkModalVisible(false);
        }}
      />

      <ConfirmModal
        visible={disconnectModalVisible}
        title="TERMINATE_SESSION"
        message="Are you sure you want to disconnect? Active cryptographic signatures will be revoked."
        onCancel={() => setDisconnectModalVisible(false)}
        onConfirm={() => {
          wallet.disconnect();
          setDisconnectModalVisible(false);
        }}
      />

      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        
        {/* HEADER */}
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text style={s.appname_first}>SYSTEM</Text>
            <Text style={s.appname_second}>_CONFIG</Text>
          </View>
          <Text style={s.subtitle}>Core Environment & Node Management</Text>
        </View>

        {/* 1. SESSION GATEWAY (NEW SECTION) */}
        <Text style={s.sectionHeader}>SESSION_GATEWAY</Text>
        <View style={[s.configCard, wallet.connected && { borderColor: COLORS.green }]}>
          <View style={localStyles.gatewayHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
               <View style={[localStyles.pulseDot, { backgroundColor: wallet.connected ? COLORS.green : COLORS.red }]} />
               <Text style={[localStyles.statusText, { color: wallet.connected ? COLORS.green : COLORS.red }]}>
                 {wallet.connected ? "STABLE_CONNECTION" : "NO_ACTIVE_SESSION"}
               </Text>
            </View>
            <Text style={localStyles.versionText}>AUTH_v2.1</Text>
          </View>

          {wallet.connected ? (
            <View style={localStyles.connectedBody}>
              <View style={localStyles.addressBox}>
                <Image 
                  source={{ uri: "https://api.phantom.app/image-proxy/?image=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fsolana-labs%2Ftoken-list%40main%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png" }} 
                  style={localStyles.miniIcon} 
                />
                <Text style={localStyles.addressText}>{short(wallet.publicKey || "", 12)}</Text>
              </View>
              
              <TouchableOpacity 
                style={localStyles.disconnectAction} 
                onPress={() => setDisconnectModalVisible(true)}
              >
                <Text style={localStyles.disconnectText}>TERMINATE_SESSION</Text>
                <Ionicons name="power-sharp" size={14} color={COLORS.red} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={localStyles.connectAction} 
              onPress={wallet.connect}
              disabled={wallet.connecting}
            >
              <Text style={localStyles.connectText}>
                {wallet.connecting ? "INITIALIZING..." : "CONNECT_WALLET"}
              </Text>
              <Ionicons name="link-sharp" size={16} color={COLORS.green} />
            </TouchableOpacity>
          )}
        </View>

        {/* 2. NETWORK SECTION */}
        <Text style={s.sectionHeader}>NETWORK_LAYER</Text>
        <View style={[s.configCard, isDevnet && { borderColor: COLORS.TESTNET_COLOR }]}>
          <Text style={[s.label, isDevnet && { color: COLORS.TESTNET_COLOR }]}>ACTIVE_ENVIRONMENT</Text>
          <View style={s.settingRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons
                name={isDevnet ? "flask-sharp" : "globe-sharp"}
                size={18}
                color={isDevnet ? COLORS.TESTNET_COLOR : COLORS.green}
              />
              <Text style={[s.settingLabel, isDevnet && { color: COLORS.TESTNET_COLOR }]}>
                {isDevnet ? "TESTNET_DEV_MODE" : "SOLANA_MAINNET"}
              </Text>
            </View>
            <Switch
              value={isDevnet}
              onValueChange={() => setNetworkModalVisible(true)}
              trackColor={{ true: COLORS.TESTNET_COLOR, false: COLORS.line }}
              thumbColor={COLORS.primary}
            />
          </View>
        </View>

        {/* 3. DATA SECTION */}
        <Text style={s.sectionHeader}>STORAGE_MANIFEST</Text>
        <View style={s.configCard}>
          <TouchableOpacity 
            style={s.settingRow} 
            onPress={() => router.push("/fav_wallet/watchlist")}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="heart" size={16} color={COLORS.red} />
              <Text style={s.settingLabel}>FAV_WALLETS</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={localStyles.countText}>{favorites.length}</Text>
              <Ionicons name="chevron-forward" size={14} color={COLORS.muted} />
            </View>
          </TouchableOpacity>

          <View style={s.innerDivider} />

          <View style={s.settingRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="time" size={16} color={COLORS.accent} />
              <Text style={s.settingLabel}>SEARCH_CACHE</Text>
            </View>
            <Text style={localStyles.countText}>{searchHistory.length} ENTRIES</Text>
          </View>
        </View>

        {/* 4. DANGER ZONE */}
        <Text style={[s.sectionHeader, { color: COLORS.red }]}>PURGE_COMMANDS</Text>
        <TouchableOpacity
          style={s.dangerBtn}
          onPress={() => setPurgeModalVisible(true)}
        >
          <Ionicons name="trash-sharp" size={16} color={COLORS.red} />
          <Text style={s.dangerBtnText}>CLEAR_HISTORY_BUFFER</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  gatewayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    paddingBottom: 10
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '900',
    letterSpacing: 1
  },
  versionText: {
    color: COLORS.line,
    fontSize: 8,
    fontFamily: 'monospace'
  },
  connectedBody: {
    gap: 15
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    gap: 12
  },
  miniIcon: {
    width: 16,
    height: 16
  },
  addressText: {
    color: COLORS.primary,
    fontFamily: 'monospace',
    fontSize: 13
  },
  connectAction: {
    borderWidth: 1,
    borderColor: COLORS.green,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(20, 241, 149, 0.05)'
  },
  connectText: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: 1
  },
  disconnectAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8
  },
  disconnectText: {
    color: COLORS.red,
    fontSize: 9,
    fontFamily: 'monospace',
    fontWeight: 'bold'
  },
  countText: {
    color: COLORS.green,
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold'
  }
});