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
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";
import BlogSection from "./blogs/components/BlogSection";

const HomeScreen = ({ navigation }) => {
  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin user đã đăng nhập
    AsyncStorage.getItem("user").then((userData) => {
      if (userData) setUser(JSON.parse(userData));
    });

    api.get("/exercises").then((res) => setExercises(res.data));
    api.get("/workouts").then((res) => setWorkouts(res.data));
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>
        Chào mừng {user?.name} đến với Fitness Online
      </Text>

      {/* Tiến trình cá nhân */}
      <View style={styles.progressContainer}>
        <Text style={styles.sectionTitle}>Tiến trình của bạn</Text>
        <TouchableOpacity
          style={styles.progressButton}
          onPress={() => navigation.navigate("Progress", { userId: user?.id })}
        >
          <Text style={styles.progressButtonText}>Xem Tiến Trình</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.progressButton}
          onPress={() =>
            navigation.navigate("AddProgress", { userId: user?.id })
          }
        >
          <Text style={styles.progressButtonText}>Thêm Tiến Trình</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.progressButton}
          onPress={() => navigation.navigate("WorkoutHistory")}
        >
          <Text style={styles.progressButtonText}>Lịch sử luyện tập</Text>
        </TouchableOpacity>

          {/* BMI calculate and meal plan for BMI */}
        <TouchableOpacity
          style={styles.progressButton}
          onPress={() => navigation.navigate("BMIGuide")}
        >
          <Text style={styles.progressButtonText}>Xem chế độ ăn dựa vào chỉ số BMI</Text>
        </TouchableOpacity>
      </View>

      {/* Chương trình tập luyện */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chương trình tập luyện</Text>
        <FlatList
          horizontal
          data={workouts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("ExerciseDetail", { id: item.id })
              }
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={styles.workoutButton}
          onPress={() => navigation.navigate("WorkoutPlan")}
        >
          <Text style={styles.workoutButtonText}>
            Xem Chương Trình Tập Luyện
          </Text>
        </TouchableOpacity>
      </View>

      {/* Blogs contents */}
      <BlogSection navigation={navigation}/>

      {/* Bài tập gợi ý */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bài tập gợi ý</Text>
        <FlatList
          horizontal
          data={exercises}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.exerciseCard}
              onPress={() =>
                navigation.navigate("ExerciseDetail", { id: item.id })
              }
            >
              <Image
                source={{ uri: item.image }}
                style={styles.exerciseImage}
              />
              <Text style={styles.exerciseTitle}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScrollView>
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
  progressContainer: {
    backgroundColor: "#ffdd57",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: "#333",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  exerciseCard: {
    marginRight: 10,
    alignItems: "center",
  },
  exerciseImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  exerciseTitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  workoutButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  workoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  progressButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  progressButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
