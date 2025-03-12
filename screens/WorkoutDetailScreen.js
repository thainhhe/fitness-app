import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import api from "../api";

const WorkoutDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [workoutPlan, setWorkoutPlan] = useState(null);

  useEffect(() => {
    api
      .get(`/workoutPlans/${id}`)
      .then((res) => {
        console.log("Fetched workout plan:", res.data);
        setWorkoutPlan(res.data);
      })
      .catch((error) => console.error("Error fetching workout plan:", error));
  }, []);

  return (
    <View>
      {workoutPlan ? (
        <>
          <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
            {workoutPlan.name}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Lịch trình:</Text>
          <FlatList
            data={workoutPlan.days}
            keyExtractor={(item) => item.day.toString()}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  Ngày {item.day}
                </Text>
                <FlatList
                  data={item.exercises}
                  keyExtractor={(exercise) => exercise.id.toString()}
                  renderItem={({ item: exercise }) => (
                    <Text style={{ fontSize: 16 }}>{exercise.name}</Text>
                  )}
                />
              </View>
            )}
          />
        </>
      ) : (
        <Text>Đang tải...</Text>
      )}
    </View>
  );
};

export default WorkoutDetailScreen;
