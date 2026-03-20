import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { COLORS, s } from "../../src/styles/styles";
import { RPCS, short, timeAgo } from "../../src/utils";
import { useRouter } from "expo-router";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useWalletStore } from "../../src/store/wallet-store";
import { ConfirmModal } from "../../src/components/ConfirmModal"; 
import "../../src/polyfills";

// --- SUB-COMPONENT: FAVORITE BUTTON ---
const FavoriteButton = ({ address }: { address: string }) => {
  const favorites = useWalletStore((s) => s.favorites);
  const toggleFavorite = useWalletStore((s) => s.toggleFavorite);
  const isFav = favorites.includes(address);

  return (
    <TouchableOpacity onPress={() => toggleFavorite(address)}>
      <Ionicons
        name={isFav ? "heart" : "heart-outline"}
        size={20}
        color={isFav ? COLORS.red : COLORS.muted}
      />
    </TouchableOpacity>
  );
};

export default function WalletScreen() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [txns, setTxns] = useState<any[]>([]);
  
  // MODAL STATE
  const [isNetworkModalVisible, setNetworkModalVisible] = useState(false);

  const router = useRouter();
  const isDevnet = useWalletStore((s) => s.isDevnet);
  const toggleNetwork = useWalletStore((s) => s.toggleNetwork);
  const addToHistory = useWalletStore((s) => s.addToHistory);
  const searchHistory = useWalletStore((s) => s.searchHistory);

  const network = isDevnet ? "devnet" : "mainnet";

  // --- RPC UTILITIES ---
  const rpc = async (method: string, params: any[]) => {
    const res = await fetch(RPCS[network], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error.message);
    return json.result;
  };

  const getBalance = async (addr: string) => {
    const result = await rpc("getBalance", [addr]);
    return result.value / 1_000_000_000;
  };

  const getTokens = async (addr: string) => {
    const result = await rpc("getTokenAccountsByOwner", [
      addr,
      { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
      { encoding: "jsonParsed" },
    ]);
    return (result.value || [])
      .map((a: any) => ({
        mint: a.account.data.parsed.info.mint,
        amount: a.account.data.parsed.info.tokenAmount.uiAmount || 0,
      }))
      .filter((t: any) => t.amount > 0);
  };

  const getTransactions = async (addr: string) => {
    const result = await rpc("getSignaturesForAddress", [addr, { limit: 10 }]);
    return result.map((s: any) => ({
      sig: s.signature,
      time: s.blockTime,
      ok: !s.err,
    }));
  };

  // --- SEARCH WITH VALIDATION ---
  const search = async (overrideAddr?: string) => {
    const addr = (overrideAddr || address).trim();
    
    // VALIDATION: Solana addresses are 32-44 chars
    const isValidLength = addr.length >= 32 && addr.length <= 44;

    if (!addr) return;

    if (!isValidLength) {
      Alert.alert("INVALID_ADDRESS", "The string provided does not meet Solana length standards (32-44 chars).");
      return;
    }

    setLoading(true);
    
    try {
      const [bal, tok, tx] = await Promise.all([
        getBalance(addr),
        getTokens(addr),
        getTransactions(addr),
      ]);
      
      // Only add to history if search succeeds
      addToHistory(addr); 
      setBalance(bal);
      setTokens(tok);
      setTxns(tx);
    } catch (e: any) {
      Alert.alert("NODE_ERROR", e.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address.trim()) search();
  }, [network]);

  const clearResults = () => {
    setAddress("");
    setBalance(null);
    setTokens([]);
    setTxns([]);
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* MODAL PLACED AT TOP LEVEL TO ENSURE VISIBILITY */}
      <ConfirmModal
        visible={isNetworkModalVisible}
        title="SWITCH_NETWORK"
        message={`DANGER: System is re-routing to ${isDevnet ? "MAINNET" : "DEVNET"}. RPC buffers will be flushed.`}
        onCancel={() => setNetworkModalVisible(false)}
        onConfirm={() => {
          toggleNetwork();
          setNetworkModalVisible(false);
        }}
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
          
          {/* HEADER */}
          <View style={s.header}>
            <View style={{ flexDirection: "row" }}>
              <Text style={s.appname_first}>SOL</Text>
              <Text style={s.appname_second}>Peek👀</Text>
            </View>
            <TouchableOpacity 
              style={[s.networkBtn, isDevnet && { borderColor: COLORS.TESTNET_COLOR }]} 
              onPress={() => setNetworkModalVisible(true)}
            >
              <Text style={[s.networkText, isDevnet && { color: COLORS.TESTNET_COLOR }]}>
                {network.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={s.subtitle}>
            Explore any{" "}
            <View style={{ height: 14, width: 55, marginBottom: -3 }}>
              <MaskedView style={{ flex: 1 }} maskElement={<Text style={s.soltext}>SOLANA</Text>}>
                <LinearGradient
                  colors={[COLORS.solana_purple, COLORS.solana_blue, COLORS.green]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }}
                />
              </MaskedView>
            </View>{" "}
            wallet
          </Text>

          {/* INPUT AREA */}
          <View style={s.inputContainer}>
            <TextInput
              style={s.input}
              placeholder="Solana wallet address..."
              placeholderTextColor="#555"
              value={address}
              onChangeText={setAddress}
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={() => search()}
            />
          </View>

          <View style={s.btnRow}>
            <TouchableOpacity 
              style={[s.btn, loading && s.btnDisabled]} 
              onPress={() => search()} 
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Search</Text>}
            </TouchableOpacity>

            {(balance !== null || tokens.length > 0) && (
              <TouchableOpacity style={s.btnGhost} onPress={clearResults}>
                <Text style={s.btnGhostText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* HISTORY SECTION */}
          {searchHistory.length > 0 && balance === null && (
            <View style={{ marginTop: 40 }}>
              <Text style={s.section}>Recent Searches</Text>
              {searchHistory.slice(0, 5).map((addr) => (
                <TouchableOpacity key={addr} style={s.row} onPress={() => { setAddress(addr); search(addr); }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons name="time-outline" size={14} color={COLORS.muted} />
                    <Text style={s.mint}>{short(addr, 8)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color={COLORS.muted} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* BALANCE CARD */}
          {balance !== null && (
            <View style={s.card}>
              <View style={{ position: "absolute", top: 15, right: 15 }}>
                <FavoriteButton address={address.trim()} />
              </View>
              <Text style={s.label}>SOL Balance</Text>
              <View style={s.balanceRow}>
                <Text style={s.balance}>{balance.toFixed(4)}</Text>
                <Text style={s.soltextsecond}> SOL</Text>
              </View>
              <View style={s.addrContainer}>
                <Image 
                  source={{ uri: "https://api.phantom.app/image-proxy/?image=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fsolana-labs%2Ftoken-list%40main%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png" }} 
                  style={s.solIcon} 
                />
                <Text style={s.addrText}>{short(address.trim(), 8)}</Text>
              </View>
            </View>
          )}

          {/* TOKENS LIST */}
          {tokens.length > 0 && (
            <>
              <Text style={s.section}>Tokens ({tokens.length})</Text>
              <FlatList
                data={tokens}
                keyExtractor={(t) => t.mint}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity style={s.row} onPress={() => router.push(`/token/${item.mint}?amount=${item.amount}`)}>
                    <Text style={s.mint}>{short(item.mint, 6)}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text style={s.amount}>{item.amount}</Text>
                      <Ionicons name="chevron-forward" size={12} color={COLORS.muted} />
                    </View>
                  </TouchableOpacity>
                )}
              />
            </>
          )}

          {/* TRANSACTIONS LIST */}
          {txns.length > 0 && (
            <>
              <Text style={s.section}>Recent Transactions</Text>
              <FlatList
                data={txns}
                keyExtractor={(t) => t.sig}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity style={s.row} onPress={() => Linking.openURL(`https://solscan.io/tx/${item.sig}`)}>
                    <View>
                      <Text style={s.mint}>{short(item.sig, 12)}</Text>
                      <Text style={s.time}>{item.time ? timeAgo(item.time) : "Pending..."}</Text>
                    </View>
                    <Text style={{ color: item.ok ? COLORS.green : COLORS.red, fontSize: 16 }}>
                      {item.ok ? "✓" : "✗"}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </>
          )}

          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}