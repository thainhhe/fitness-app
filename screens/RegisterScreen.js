import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import api from "../api";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const generateVerificationCode = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const register = async () => {
    console.log("📌 Hàm register được gọi!");

    // Gửi yêu cầu kiểm tra email tồn tại chưa
    const { data: users } = await api.get("/users", { params: { email } });

    if (users.length > 0) {
      console.log("❌ Email đã tồn tại!");
      Alert.alert("Email đã tồn tại!");
      return;
    }

    const verificationCode = generateVerificationCode();
    console.log(`🔢 Mã xác thực: ${verificationCode}`);

    try {
      // Gửi email xác thực
      const emailRes = await fetch(
        "http://192.168.1.102:5001/send-verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: verificationCode }),
        }
      );

      console.log("📨 Gửi email thành công:", await emailRes.text());

      // Lưu user vào JSON Server
      const saveRes = await api.post("/users", {
        name,
        email,
        password,
        verified: false,
        verificationCode,
      });

      console.log("✅ Lưu user thành công:", saveRes.data);

      Alert.alert(
        "Đăng ký thành công!",
        "Hãy kiểm tra email để nhập mã xác thực."
      );
      navigation.navigate("VerifyEmail", { email });
    } catch (error) {
      console.error("❌ Lỗi khi đăng ký:", error);
      Alert.alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên"
        onChangeText={setName}
        value={name}
      />
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
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Đăng ký" onPress={register} />
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

export default RegisterScreen;
