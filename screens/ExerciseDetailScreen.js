import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import api from "../api";

const ExerciseDetailScreen = ({ route }) => {
  const { id } = route.params || {};
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("Không có ID để gọi API!");
      return;
    }

    console.log(
      "Gọi API với URL:",
      `http://192.168.100.140:3001/exercises/${id}`
    );

    api
      .get(`/exercises/${id}`)
      .then((res) => {
        console.log("Dữ liệu trả về:", res.data);
        setExercise(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="blue" />;

  if (!exercise)
    return <Text style={styles.errorText}>Không tìm thấy bài tập!</Text>;

  return (
    <ScrollView style={styles.container}>
      {/* Tiêu đề bài tập */}
      <Text style={styles.title}>{exercise.name}</Text>

      {/* Hình ảnh bài tập */}
      {exercise.image ? (
        <Image source={{ uri: exercise.image }} style={styles.image} />
      ) : (
        <Text style={styles.noImageText}>Không có hình ảnh</Text>
      )}

      {/* Mô tả bài tập */}
      <Text style={styles.description}>{exercise.description}</Text>

      {/* Hướng dẫn thực hiện */}
      {exercise.instructions?.length > 0 && (
        <>
          <Text style={styles.subTitle}>Cách thực hiện:</Text>
          {exercise.instructions.map((step, index) => (
            <Text key={index} style={styles.instructionItem}>
              {`\u2022 ${step}`}
            </Text>
          ))}
        </>
      )}

      {/* Số rep/set gợi ý */}
      {exercise.reps_sets && (
        <>
          <Text style={styles.subTitle}>Số rep/set gợi ý:</Text>
          <Text style={styles.repSetText}>
            🔰 Người mới: {exercise.reps_sets?.beginner || "Không có dữ liệu"}
          </Text>
          <Text style={styles.repSetText}>
            ⚡ Trung bình:{" "}
            {exercise.reps_sets?.intermediate || "Không có dữ liệu"}
          </Text>
          <Text style={styles.repSetText}>
            🔥 Nâng cao: {exercise.reps_sets?.advanced || "Không có dữ liệu"}
          </Text>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: "contain",
  },
  noImageText: {
    fontSize: 16,
    textAlign: "center",
    color: "#999",
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "justify",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  instructionItem: {
    fontSize: 16,
    marginBottom: 5,
    paddingLeft: 10,
  },
  repSetText: {
    fontSize: 16,
    marginBottom: 5,
    paddingLeft: 10,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ExerciseDetailScreen;
