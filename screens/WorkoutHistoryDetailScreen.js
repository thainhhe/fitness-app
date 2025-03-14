import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import api from "../api";

const WorkoutHistoryDetailScreen = ({ route, navigation }) => {
  const { sessionId, exerciseId } = route.params;
  const [note, setNote] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    api.get(`/workoutHistory/${sessionId}`).then((res) => {
      const exercise = res.data.exercises.find((ex) => ex.id === exerciseId);
      if (exercise) {
        setCompleted(exercise.completed);
        setNote(exercise.note);
      }
    });
  }, [sessionId, exerciseId]);

  const saveChanges = () => {
    api.get(`/workoutHistory/${sessionId}`).then((res) => {
      const updatedExercises = res.data.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, completed, note } : ex
      );

      api
        .patch(`/workoutHistory/${sessionId}`, { exercises: updatedExercises })
        .then(() => {
          Alert.alert("Thành công", "Cập nhật bài tập thành công!");
          navigation.goBack();
        })
        .catch((error) => {
          console.error("Lỗi khi cập nhật:", error);
          Alert.alert("Lỗi", "Không thể cập nhật bài tập.");
        });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cập nhật bài tập</Text>
      <Text>Hoàn thành?</Text>
      <Button
        title={completed ? "✅ Đã hoàn thành" : "❌ Chưa hoàn thành"}
        onPress={() => setCompleted(!completed)}
      />
      <TextInput
        style={styles.input}
        placeholder="Thêm ghi chú..."
        value={note}
        onChangeText={setNote}
      />
      <Button title="Lưu" onPress={saveChanges} />
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
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});

export default WorkoutHistoryDetailScreen;
