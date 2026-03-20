import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  LayoutAnimation, // Added for smooth vanishing
  Platform,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useWalletStore } from "../../src/store/wallet-store";
import { s, COLORS } from "../../src/styles/styles";
import { short } from "../../src/utils";

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface WatchlistItem {
  address: string;
  balance: number | null;
  loading: boolean;
}

export default function WatchlistScreen() {
  const router = useRouter();
  const favorites = useWalletStore((s) => s.favorites);
  const removeFavorite = useWalletStore((s) => s.removeFavorite);
  const isDevnet = useWalletStore((s) => s.isDevnet);

  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const network = isDevnet ? "devnet" : "mainnet";
  const RPC = isDevnet ? "https://api.devnet.solana.com" : "https://api.mainnet-beta.solana.com";

  const fetchBalances = useCallback(async () => {
    const results = await Promise.all(
      favorites.map(async (address) => {
        try {
          const res = await fetch(RPC, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "getBalance",
              params: [address],
            }),
          });
          const json = await res.json();
          return { address, balance: (json.result?.value || 0) / 1e9, loading: false };
        } catch {
          return { address, balance: null, loading: false };
        }
      })
    );
    setItems(results);
  }, [favorites, RPC]);

  useEffect(() => {
    if (favorites.length > 0) {
      setItems(prev => {
        // Only trigger loading for truly new items to prevent flicker
        return favorites.map(addr => {
          const existing = prev.find(p => p.address === addr);
          return existing ? existing : { address: addr, balance: null, loading: true };
        });
      });
      fetchBalances();
    } else {
      setItems([]);
    }
  }, [favorites, fetchBalances]);

  const handleRemove = (address: string) => {
    // Configure animation for the "Vanishing" effect
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    removeFavorite(address);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBalances();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <View style={localStyles.container}>
        
        {/* HEADER AREA */}
        <TouchableOpacity style={{ marginBottom: 20 }} onPress={() => router.back()}>
          <Ionicons name="arrow-back-sharp" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={{ flexDirection: "row", marginBottom: 5 }}>
          <Text style={s.appname_first}>WALLETS</Text>
          <Text style={s.appname_second}>_WATCH</Text>
        </View>
        <Text style={s.subtitle}>
          {favorites.length} NODE{favorites.length !== 1 ? "S" : ""} TRACKED // {network.toUpperCase()}
        </Text>

        {favorites.length === 0 ? (
          <View style={localStyles.emptyContainer}>
            <Ionicons name="eye-off-outline" size={48} color={COLORS.line} />
            <Text style={localStyles.emptyTitle}>WATCHLIST_EMPTY</Text>
            <Text style={localStyles.emptyText}>SAVE A WALLET TO INITIALIZE TRACKING.</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.address}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.green} />
            }
            renderItem={({ item }) => (
              <View style={localStyles.brutalistCard}>
                <View style={localStyles.cardLeft}>
                  <Ionicons name="radio-button-on" size={12} color={COLORS.green} />
                  <Text style={localStyles.cardAddress}>{short(item.address, 6)}</Text>
                </View>

                <View style={localStyles.cardRight}>
                  {item.loading ? (
                    <ActivityIndicator size="small" color={COLORS.green} />
                  ) : (
                    <View style={{ alignItems: 'flex-end', marginRight: 15 }}>
                      <Text style={localStyles.cardBalance}>{item.balance?.toFixed(2) || "0.00"}</Text>
                      <Text style={{ color: COLORS.muted, fontSize: 8 }}>SOL</Text>
                    </View>
                  )}
                  
                  {/* REMOVE BUTTON - EXECUTOR */}
                  <TouchableOpacity 
                    onPress={() => handleRemove(item.address)}
                    style={localStyles.removeBtn}
                  >
                    <Ionicons name="trash-outline" size={16} color={COLORS.red} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25, paddingTop: 10 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", marginBottom: 100 },
  emptyTitle: { color: COLORS.primary, fontSize: 14, fontWeight: "900", letterSpacing: 2, marginTop: 20 },
  emptyText: { color: COLORS.muted, fontSize: 10, fontFamily: "monospace", textAlign: "center", marginTop: 10 },
  brutalistCard: {
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: -1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardAddress: { color: COLORS.primary, fontSize: 13, fontFamily: "monospace" },
  cardRight: { flexDirection: 'row', alignItems: 'center' },
  cardBalance: { color: COLORS.green, fontSize: 14, fontFamily: "monospace", fontWeight: "bold" },
  removeBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  }
});