import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await api.post("/login", { email, password });
      if (res.data.user) {
        await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
        navigation.navigate("Home");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Sai thông tin đăng nhập");
    }
  };

  const forgotPassword = async () => {
    if (!email) {
      alert("Vui lòng nhập email");
      return;
    }
    try {
      await api.post("/forgot-password", { email });
      alert("Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn");
    } catch (error) {
      alert(error.response?.data?.error || "Có lỗi xảy ra");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <Button title="Đăng nhập" onPress={login} />
      <View style={styles.buttonContainer}>
        <Button
          title="Đăng ký"
          onPress={() => navigation.navigate("Register")}
        />
        <Button title="Quên mật khẩu?" onPress={forgotPassword} />
      </View>
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
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
});

export default AuthScreen;
