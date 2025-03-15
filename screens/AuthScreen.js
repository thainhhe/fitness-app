import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu!");
      return;
    }

    try {
      const res = await api.get("/users", { params: { email, password } });

      if (res.data.length > 0) {
        const user = res.data[0];

        if (!user.verified) {
          Alert.alert("Lỗi", "Vui lòng xác thực email trước khi đăng nhập.");
          return;
        }

        await AsyncStorage.setItem("user", JSON.stringify(user));
        navigation.navigate("Home");
      } else {
        Alert.alert("Lỗi", "Sai thông tin đăng nhập!");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại!");
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
      <View style={styles.buttonGroup}>
        <Button
          title="Đăng ký"
          onPress={() => navigation.navigate("Register")}
        />
        <Button
          title="Quên mật khẩu"
          onPress={() => navigation.navigate("ForgotPassword")}
        />
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
  buttonGroup: {
    marginTop: 10,
  },
});

export default AuthScreen;
