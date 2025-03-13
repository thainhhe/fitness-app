import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import api from "../api";

const WorkoutDetailScreen = ({ route, navigation }) => {
  const { id, day } = route.params;
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // Fetch danh sách bài tập
    api.get("/exercises").then((res) => setExercises(res.data));

    // Fetch chương trình tập luyện
    api.get(`/workoutPlans/${id}`).then((res) => {
      const selectedDay = res.data.days.find((d) => d.day === day);
      if (selectedDay) {
        // Lọc bài tập theo danh sách id
        const matchedExercises = exercises.filter((ex) =>
          selectedDay.exercises.includes(ex.id)
        );
        setWorkout({ ...selectedDay, exercises: matchedExercises });
      }
    });
  }, [id, day, exercises]);

  if (!workout) {
    return <Text style={styles.loading}>Đang tải...</Text>;
  }

  return (
    <FlatList
      ListHeaderComponent={
        <Text style={styles.header}>Bài tập - Ngày {workout.day}</Text>
      }
      data={workout.exercises}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.exerciseCard}
          onPress={() => navigation.navigate("ExerciseDetail", { id: item.id })}
        >
          <Image source={{ uri: item.image }} style={styles.exerciseImage} />
          <Text style={styles.exerciseTitle}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  loading: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  exerciseImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WorkoutDetailScreen;
