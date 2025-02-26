import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await api.get("/users", { params: { email, password } });
    if (res.data.length > 0) {
      await AsyncStorage.setItem("user", JSON.stringify(res.data[0]));
      navigation.navigate("Home");
    } else {
      alert("Sai thông tin đăng nhập");
    }
  };

  return (
    <View>
      <Text>Đăng nhập</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput
        placeholder="Mật khẩu"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Đăng nhập" onPress={login} />
    </View>
  );
};

export default AuthScreen;
