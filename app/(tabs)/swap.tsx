import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, s } from "../../src/styles/styles";
import { ConnectButton } from "../../src/components/ConnectButton";
import { useWallet } from "../../src/hooks/useWallet";
import { ConnectedWalletCard } from "../../src/components/ConnectedWalletCard";

const TOKEN_DATA: { [key: string]: { id: string; logo: string } } = {
  SOL: {
    id: "So11111111111111111111111111111111111111112",
    logo: "https://api.phantom.app/image-proxy/?image=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fsolana-labs%2Ftoken-list%40main%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png&fit=cover&width=128&height=128",
  },
  USDC: {
    id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    logo: "https://api.phantom.app/image-proxy/?image=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FEPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v%2Flogo.png&fit=cover&width=128&height=128",
  },
};

export default function SwapScreen() {
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);

  // Swap State
  const [fromAmount, setFromAmount] = useState("1.00");
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("USDC");
  const [solPrice, setSolPrice] = useState<number>(0);

  const isConnected = wallet.connected;

  // Price Fetching Logic (Jupiter v4)
  const fetchPrice = async () => {
    setPriceLoading(true);

    try {
      const solId = TOKEN_DATA["SOL"].id;

      const response = await fetch(
        `https://price.jup.ag/v6/price?ids=${solId}`,
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();

      const price = json?.data?.[solId]?.price ?? 0;

      if (price > 0) setSolPrice(price);
    } catch (err) {
      console.warn("Price sync failed, using last known value.");
    } finally {
      setPriceLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 15000);
    return () => clearInterval(interval);
  }, []);

  const swapDirection = () => {
    const prev = fromToken;
    setFromToken(toToken);
    setToToken(prev);
  };

  const handleAction = async () => {
    if (!isConnected) {
      await wallet.connect();
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("SWAP_INITIATED", "Broadcasting to Jupiter Aggregator...");
    }, 1500);
  };

  const amountNum = parseFloat(fromAmount || "0");
  const displayUsdValue =
    fromToken === "SOL"
      ? (amountNum * solPrice).toFixed(2)
      : amountNum.toFixed(2);
  const estimatedReceive =
    fromToken === "SOL"
      ? (amountNum * solPrice).toFixed(2)
      : solPrice > 0
        ? (amountNum / solPrice).toFixed(4)
        : "0.00";

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {/* NEW THEMED HEADER SECTION */}
        <View style={{ marginBottom: 30 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={s.appname_first}>ASSET</Text>
              <Text style={s.appname_second}>_SWAP</Text>
            </View>
            <ConnectButton
              connected={wallet.connected}
              connecting={wallet.connecting}
              publicKey={wallet.publicKey ?? null}
              onConnect={wallet.connect}
              onDisconnect={wallet.disconnect}
            />
          </View>
          <View
            style={{
              height: 1,
              backgroundColor: COLORS.line,
              width: "30%",
              marginBottom: 8,
            }}
          />
          <Text style={s.subtitle}>Jupiter Aggregator Core</Text>
        </View>

        {/* PAYING CARD */}
        <View style={s.swapcard}>
          <Text style={s.label}>PAYING</Text>
          <View style={s.cardHeader}>
            <TouchableOpacity style={s.tokenSelector} onPress={swapDirection}>
              <Image
                source={{ uri: TOKEN_DATA[fromToken].logo }}
                style={s.tokenIconImage}
              />
              <Text style={s.tokenName}>{fromToken}</Text>
              <Ionicons name="swap-horizontal" size={12} color={COLORS.muted} />
            </TouchableOpacity>
            <TextInput
              style={s.amountInput}
              value={fromAmount}
              onChangeText={setFromAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={COLORS.line}
            />
          </View>
          <View style={s.cardFooter}>
            <Text style={s.balanceText}>
              RATE: 1 {fromToken} = $
              {fromToken === "SOL" ? solPrice.toFixed(2) : "1.00"}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {priceLoading && (
                <ActivityIndicator
                  size="small"
                  color={COLORS.muted}
                  style={{ marginRight: 8 }}
                />
              )}
              <Text style={s.usdText}>≈ ${displayUsdValue}</Text>
            </View>
          </View>
        </View>

        {/* INTERSECTION */}
        <View style={s.arrowContainer}>
          <TouchableOpacity style={s.swapArrow} onPress={swapDirection}>
            <Ionicons name="arrow-down-sharp" size={20} color={COLORS.green} />
          </TouchableOpacity>
        </View>

        {/* RECEIVING CARD */}
        <View style={[s.swapcard, { marginTop: -1 }]}>
          <Text style={s.label}>RECEIVING</Text>
          <View style={s.cardHeader}>
            <TouchableOpacity style={s.tokenSelector} disabled>
              <Image
                source={{ uri: TOKEN_DATA[toToken].logo }}
                style={s.tokenIconImage}
              />
              <Text style={s.tokenName}>{toToken}</Text>
            </TouchableOpacity>
            <Text style={[s.amountInput, { opacity: priceLoading ? 0.3 : 1 }]}>
              {estimatedReceive}
            </Text>
          </View>
          <View style={s.cardFooter}>
            <Text style={s.balanceText}>SLIPPAGE_TOLERANCE: 0.5%</Text>
            <Text style={s.usdText}>EST_VALUE: ${displayUsdValue}</Text>
          </View>
        </View>

        {/* ACTION BUTTON */}
        <View style={[s.btnRow, { marginTop: 40 }]}>
          <TouchableOpacity
            style={[
              s.btn,
              loading && s.btnDisabled,
              !isConnected && {
                borderColor: COLORS.green,
                borderStyle: "dashed",
              },
            ]}
            onPress={handleAction}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <Text
                style={[s.btnText, !isConnected && { color: COLORS.green }]}
              >
                {isConnected ? "EXECUTE_SWAP" : "CONNECT_TO_SWAP"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {isConnected && (
          <TouchableOpacity
            onPress={wallet.disconnect}
            style={{ marginTop: 25, alignItems: "center" }}
          >
            <Text
              style={{
                color: COLORS.muted,
                fontSize: 10,
                fontFamily: "monospace",
              }}
            >
              [ TERMINATE_SESSION ]
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
