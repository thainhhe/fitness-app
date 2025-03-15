import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WorkoutCompletionScreen = ({ route, navigation }) => {
  const { workoutName, exercises } = route.params;
  const [userId, setUserId] = useState(null);
  const [completedExercises, setCompletedExercises] = useState({});
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [existingHistory, setExistingHistory] = useState(null);

  useEffect(() => {
    const fetchUserAndHistory = async () => {
      try {
        setLoading(true);
        // Lấy thông tin người dùng
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.id);

          // Kiểm tra xem đã có lịch sử tập luyện hôm nay chưa
          const today = new Date().toISOString().split("T")[0];
          const res = await api.get(
            `/workoutHistory?userId=${user.id}&date=${today}`
          );

          if (res.data.length > 0) {
            const history = res.data[0];
            setExistingHistory(history);

            // Khởi tạo trạng thái hoàn thành và ghi chú từ dữ liệu hiện có
            const completed = {};
            const existingNotes = {};

            // Tìm bài tập hiện tại trong lịch sử
            history.exercises.forEach((exercise) => {
              completed[exercise.id] = exercise.completed;
              existingNotes[exercise.id] = exercise.note || "";
            });

            setCompletedExercises(completed);
            setNotes(existingNotes);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng hoặc lịch sử:", error);
        Alert.alert("Lỗi", "Không thể lấy dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndHistory();
  }, []);

  const toggleCompletion = (exerciseId) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const updateNote = (exerciseId, text) => {
    setNotes((prev) => ({
      ...prev,
      [exerciseId]: text,
    }));
  };

  const saveWorkoutHistory = async () => {
    if (!userId) {
      Alert.alert("Lỗi", "Không tìm thấy ID người dùng!");
      return;
    }

    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];

      // Chuẩn bị dữ liệu bài tập với trạng thái hoàn thành và ghi chú
      const exercisesData = exercises.map((exercise) => ({
        id: exercise.id,
        completed: completedExercises[exercise.id] || false,
        note: notes[exercise.id] || "",
      }));

      let workoutData = {
        userId,
        date: today,
        workoutName,
        exercises: exercisesData,
      };

      let response;

      if (existingHistory) {
        // Nếu đã có lịch sử, cập nhật thêm bài tập mới vào mảng exercises
        const updatedExercises = [...existingHistory.exercises];

        // Cập nhật hoặc thêm mới các bài tập
        exercisesData.forEach((newExercise) => {
          const existingIndex = updatedExercises.findIndex(
            (e) => e.id === newExercise.id
          );
          if (existingIndex >= 0) {
            updatedExercises[existingIndex] = newExercise;
          } else {
            updatedExercises.push(newExercise);
          }
        });

        response = await api.patch(`/workoutHistory/${existingHistory.id}`, {
          exercises: updatedExercises,
        });
      } else {
        // Nếu chưa có, tạo mới
        response = await api.post("/workoutHistory", workoutData);
      }

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Thành công", "Đã lưu lịch sử tập luyện!", [
          { text: "OK", onPress: () => navigation.navigate("Home") },
        ]);
      }
    } catch (error) {
      console.error("Lỗi khi lưu lịch sử tập luyện:", error);
      Alert.alert("Lỗi", "Không thể lưu lịch sử. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang xử lý...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoàn thành buổi tập</Text>
      <Text style={styles.workoutName}>{workoutName}</Text>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.exerciseContainer}>
            <TouchableOpacity
              style={styles.exerciseItem}
              onPress={() => toggleCompletion(item.id)}
            >
              <Text style={styles.exerciseText}>
                {completedExercises[item.id] ? "✅" : "❌"} {item.name}
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.noteInput}
              placeholder="Thêm ghi chú cho bài tập này..."
              value={notes[item.id] || ""}
              onChangeText={(text) => updateNote(item.id, text)}
              multiline
            />
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={saveWorkoutHistory}>
        <Text style={styles.buttonText}>Lưu Lịch Sử</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  workoutName: {
    fontSize: 18,
    textAlign: "center",
    color: "#007bff",
    marginBottom: 20,
  },
  exerciseContainer: {
    marginBottom: 15,
  },
  exerciseItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseText: {
    fontSize: 18,
  },
  noteInput: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default WorkoutCompletionScreen;
