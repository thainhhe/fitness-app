import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
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
      `http://192.168.100.140:3001/exercises?id=${id}`
    );

    api
      .get(`/exercises`, { params: { id } }) // Lọc bằng query thay vì ID trực tiếp
      .then((res) => {
        if (res.data.length > 0) {
          console.log("Dữ liệu trả về:", res.data[0]);
          setExercise(res.data[0]); // Lấy phần tử đầu tiên
        } else {
          console.log("Không tìm thấy bài tập!");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="blue" />;

  if (!exercise) return <Text>Không tìm thấy bài tập!</Text>;

  return (
    <View>
      <Text>{exercise.name}</Text>
      <Text>{exercise.description}</Text>
      {exercise.image ? (
        <Image
          source={{ uri: exercise.image }}
          style={{ width: 200, height: 200 }}
        />
      ) : (
        <Text>Không có hình ảnh</Text>
      )}
    </View>
  );
};

export default ExerciseDetailScreen;
