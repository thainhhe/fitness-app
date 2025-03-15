import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";

const CreateWorkoutScreen = ({ navigation }) => {
  const [name, setName] = useState("");

  const createWorkout = async () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên lịch tập!");
      return;
    }

    try {
      const user = await AsyncStorage.getItem("user");
      const userId = JSON.parse(user).id;
      const newWorkout = { userId, name, exercises: [] };

      await api.post("/workouts", newWorkout);
      Alert.alert("Thành công", "Lịch tập đã được tạo!");
      navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi tạo Workout:", error);
    }
  };

  return (
    <View>
      <Text>Tạo lịch tập</Text>
      <TextInput
        placeholder="Tên lịch tập"
        onChangeText={setName}
        value={name}
      />
      <Button title="Tạo" onPress={createWorkout} />
    </View>
  );
};

export default CreateWorkoutScreen;
