import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import api from "../api";

const { width } = Dimensions.get("window");

const ExerciseDetailScreen = ({ route, navigation }) => {
  const { id } = route.params || {};
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("Không có ID để gọi API!");
      return;
    }

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

  // Tạo mảng gồm các phần tử để hiển thị
  const renderExerciseContent = () => {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{exercise.name}</Text>

        {exercise.image ? (
          <Image source={{ uri: exercise.image }} style={styles.image} />
        ) : (
          <Text style={styles.noImageText}>Không có hình ảnh</Text>
        )}

        <Text style={styles.description}>{exercise.description}</Text>

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

        {/* 🔹 Nút Hoàn thành buổi tập */}
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() =>
            navigation.navigate("WorkoutCompletion", {
              workoutName: exercise.name,
              exercises: [exercise], // Chuyển bài tập hiện tại thành danh sách
            })
          }
        >
          <Text style={styles.buttonText}>Hoàn thành buổi tập</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Thay thế ScrollView bằng FlatList
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[{ key: "content" }]}
        renderItem={() => renderExerciseContent()}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    width: width,
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  contentContainer: {
    width: "100%",
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
  completeButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ExerciseDetailScreen;
