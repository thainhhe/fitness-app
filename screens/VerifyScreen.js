import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import api from "../api";

const VerifyScreen = ({ route, navigation }) => {
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { token } = route.params;
        await api.post("/verify", { token });
        alert("Xác nhận email thành công");
        navigation.replace("Auth");
      } catch (error) {
        alert("Xác nhận email thất bại");
        navigation.replace("Auth");
      }
    };

    verifyEmail();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Đang xác nhận email...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default VerifyScreen;
