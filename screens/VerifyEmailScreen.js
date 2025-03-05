import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import api from "../api";

const VerifyEmailScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [code, setCode] = useState("");

  const verifyEmail = async () => {
    const { data: users } = await api.get("/users", { params: { email } });

    if (users.length === 0) {
      Alert.alert("Email không tồn tại!");
      return;
    }

    const user = users[0];

    if (user.verificationCode !== code) {
      Alert.alert("Mã xác thực không đúng!");
      return;
    }

    await api.patch(`/users/${user.id}`, { verified: true });

    Alert.alert("Xác thực thành công!", "Bạn có thể đăng nhập ngay bây giờ.");
    navigation.navigate("Auth");
  };

  return (
    <View>
      <Text>Nhập mã xác thực đã gửi đến email</Text>
      <TextInput placeholder="Mã xác thực" onChangeText={setCode} />
      <Button title="Xác thực" onPress={verifyEmail} />
    </View>
  );
};

export default VerifyEmailScreen;
