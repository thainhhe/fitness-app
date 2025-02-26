import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import api from "../api";

const HomeScreen = ({ navigation }) => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    api.get("/exercises").then((res) => setExercises(res.data));
  }, []);

  return (
    <View>
      <Text>Danh sách bài tập</Text>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ExerciseDetail", { id: item.id })
            }
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HomeScreen;
