import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WorkoutHistoryScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem("user").then((userData) => {
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.id);
        fetchHistory(user.id);
      }
    });
  }, []);

  const fetchHistory = (userId) => {
    api
      .get(`/workoutHistory?userId=${userId}`)
      .then((res) => setHistory(res.data))
      .catch((error) => console.error("Lỗi khi lấy lịch sử:", error));
  };

  const renderHistory = ({ item }) => (
    <View style={styles.historyCard}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.workoutName}>{item.workoutName}</Text>
      <FlatList
        data={item.exercises}
        keyExtractor={(exercise) => exercise.id.toString()}
        renderItem={({ item: exercise }) => (
          <View style={styles.exerciseRow}>
            <Text style={styles.exerciseText}>
              {exercise.completed ? "✅" : "❌"} Bài tập {exercise.id}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("WorkoutHistoryDetail", {
                  sessionId: item.id,
                  exerciseId: exercise.id,
                })
              }
            >
              <Text style={styles.buttonText}>Ghi chú</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );

  return (
    <FlatList
      data={history}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderHistory}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  historyCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 10,
  },
  exerciseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  exerciseText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default WorkoutHistoryScreen;
