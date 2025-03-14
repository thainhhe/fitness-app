import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddProgressScreen = ({ route, navigation }) => {
  const [userId, setUserId] = useState(null);
  const [weight, setWeight] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [thigh, setThigh] = useState("");
  const [workoutTime, setWorkoutTime] = useState("");
  const [liftingWeight, setLiftingWeight] = useState("");
  const [errors, setErrors] = useState({}); // 🔹 Lưu lỗi nhập liệu

  useEffect(() => {
    if (route?.params?.userId) {
      setUserId(route.params.userId);
    } else {
      AsyncStorage.getItem("user").then((userData) => {
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.id);
        }
      });
    }
  }, [route]);

  // 🔹 Kiểm tra dữ liệu nhập vào
  const validateInputs = () => {
    let newErrors = {};
    if (!weight || parseFloat(weight) <= 0)
      newErrors.weight = "Cân nặng không được trống!";
    if (!workoutTime || parseInt(workoutTime) <= 0)
      newErrors.workoutTime = "Thời gian tập không được trống!";
    if (!liftingWeight || parseFloat(liftingWeight) < 0)
      newErrors.liftingWeight = "Mức tạ không được trống!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // ✅ Nếu không có lỗi, return true
  };

  const saveProgress = () => {
    if (!userId) {
      Alert.alert("Lỗi", "Không tìm thấy ID người dùng!");
      return;
    }

    if (!validateInputs()) {
      Alert.alert("Lỗi", "Vui lòng nhập đúng dữ liệu!"); // Hiển thị lỗi chung
      return;
    }

    Keyboard.dismiss(); // 🔹 Tắt bàn phím khi nhấn "Lưu tiến trình"

    const newProgress = {
      userId: userId,
      date: new Date().toISOString().split("T")[0],
      weight: parseFloat(weight),
      chest: parseFloat(chest),
      waist: parseFloat(waist),
      thigh: parseFloat(thigh),
      workoutTime: parseInt(workoutTime),
      liftingWeight: parseFloat(liftingWeight),
    };

    api
      .post("/progress", newProgress)
      .then(() => {
        Alert.alert("Thành công", "Tiến trình đã được lưu!");
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Lỗi khi lưu tiến trình:", error);
        Alert.alert("Lỗi", "Không thể lưu tiến trình.");
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* 🔹 Nhấn vào vùng trống để tắt bàn phím */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Thêm tiến trình</Text>

          {/* Ô nhập dữ liệu + Hiển thị lỗi nếu có */}
          <TextInput
            style={[styles.input, errors.weight && styles.inputError]}
            placeholder="Cân nặng (kg)"
            keyboardType="numeric"
            onChangeText={setWeight}
          />
          {errors.weight && (
            <Text style={styles.errorText}>{errors.weight}</Text>
          )}

          <TextInput
            style={[styles.input]}
            placeholder="Vòng ngực (cm)"
            keyboardType="numeric"
            onChangeText={setChest}
          />

          <TextInput
            style={[styles.input]}
            placeholder="Vòng eo (cm)"
            keyboardType="numeric"
            onChangeText={setWaist}
          />

          <TextInput
            style={[styles.input]}
            placeholder="Vòng đùi (cm)"
            keyboardType="numeric"
            onChangeText={setThigh}
          />

          <TextInput
            style={[styles.input, errors.workoutTime && styles.inputError]}
            placeholder="Thời gian tập (phút)"
            keyboardType="numeric"
            onChangeText={setWorkoutTime}
          />
          {errors.workoutTime && (
            <Text style={styles.errorText}>{errors.workoutTime}</Text>
          )}

          <TextInput
            style={[styles.input, errors.liftingWeight && styles.inputError]}
            placeholder="Mức tạ nâng (kg)"
            keyboardType="numeric"
            onChangeText={setLiftingWeight}
          />
          {errors.liftingWeight && (
            <Text style={styles.errorText}>{errors.liftingWeight}</Text>
          )}

          <Button title="Lưu tiến trình" onPress={saveProgress} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "red", // 🔹 Viền đỏ khi có lỗi
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
});

export default AddProgressScreen;
