import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { COLORS } from "../styles/styles";

interface Props {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({ visible, title, message, onConfirm, onCancel }: Props) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={styles.modalContainer}>
          {/* HEADER ACCENT */}
          <View style={styles.topBar} />
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>NO</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>YES</Text>
            </TouchableOpacity>
          </View>
          
          {/* DECORATIVE TERMINAL LINE */}
          <Text style={styles.footerCode}>// AUTH_REQ_SIG_0x1</Text>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)", // Darker backdrop
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.line,
    padding: 25,
  },
  topBar: {
    height: 4,
    backgroundColor: COLORS.red, // Danger indicator
    width: 40,
    marginBottom: 20,
  },
  title: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "900",
    fontFamily: "monospace",
    letterSpacing: 2,
    marginBottom: 10,
  },
  message: {
    color: COLORS.muted,
    fontSize: 12,
    fontFamily: "monospace",
    lineHeight: 18,
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 15,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: COLORS.red,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "800",
    fontFamily: "monospace",
  },
  confirmText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "900",
    fontFamily: "monospace",
  },
  footerCode: {
    color: COLORS.line,
    fontSize: 8,
    marginTop: 20,
    fontFamily: "monospace",
  }
});