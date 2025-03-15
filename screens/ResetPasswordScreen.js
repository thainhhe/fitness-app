import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import api from "../api";

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const resetPassword = async () => {
    try {
      const { data: users } = await api.get("/users", { params: { email } });

      if (users.length === 0) {
        Alert.alert("Lỗi", "Email không tồn tại.");
        return;
      }

      const user = users[0];

      if (user.resetCode !== resetCode) {
        Alert.alert("Lỗi", "Mã xác thực không đúng.");
        return;
      }

      await api.patch(`/users/${user.id}`, {
        password: newPassword,
        resetCode: null,
      });

      Alert.alert("Thành công", "Mật khẩu đã được đặt lại.");
      navigation.navigate("Auth");
    } catch (error) {
      console.error("Lỗi đặt lại mật khẩu:", error);
      Alert.alert("Lỗi", "Không thể đặt lại mật khẩu.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập Mã Xác Thực</Text>
      <TextInput
        style={styles.input}
        placeholder="Mã xác thực"
        keyboardType="numeric"
        onChangeText={setResetCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        secureTextEntry
        onChangeText={setNewPassword}
      />
      <Button title="Đặt lại mật khẩu" onPress={resetPassword} />
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

export default ResetPasswordScreen;
