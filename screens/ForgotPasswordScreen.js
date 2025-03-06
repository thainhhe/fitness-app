import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import api from "../api";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const sendResetCode = async () => {
    try {
      const { data: users } = await api.get("/users", { params: { email } });

      if (users.length === 0) {
        Alert.alert("Lỗi", "Email không tồn tại trong hệ thống.");
        return;
      }

      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

      await api.patch(`/users/${users[0].id}`, { resetCode });

      await fetch("http://192.168.100.140:5001/send-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resetCode }),
      });

      Alert.alert("Thành công", "Mã xác thực đã được gửi tới email của bạn.");
      navigation.navigate("ResetPassword", { email });
    } catch (error) {
      console.error("Lỗi gửi mã:", error);
      Alert.alert("Lỗi", "Không thể gửi mã xác thực.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên Mật Khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập Email"
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <Button title="Gửi mã xác thực" onPress={sendResetCode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default ForgotPasswordScreen;
