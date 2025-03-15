import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import api from "../api";

const WorkoutPlanScreen = ({ navigation }) => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null); // Cho phép hiển thị tất cả

  useEffect(() => {
    api
      .get("/workoutPlans")
      .then((res) => {
        console.log("Fetched workout plans:", res.data);
        setWorkoutPlans(res.data);
      })
      .catch((error) => console.error("Error fetching workout plans:", error));
  }, []);

  // Không lọc nếu không chọn mục tiêu
  const filteredPlans = selectedGoal
    ? workoutPlans.filter((plan) => plan.goal === selectedGoal)
    : workoutPlans;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chương trình tập luyện</Text>

      {/* Bộ lọc mục tiêu */}
      <FlatList
        horizontal
        data={[
          { goal: null, name: "Tất cả" },
          ...[
            "Tăng cơ",
            "Giảm cân",
            "Duy trì thể lực",
            "Phát triển cơ vai và tay",
          ].map((goal) => ({ goal, name: goal })),
        ]}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedGoal === item.goal && styles.activeFilter,
            ]}
            onPress={() => setSelectedGoal(item.goal)}
          >
            <Text style={styles.filterText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.filterList}
      />

      {/* Danh sách chương trình tập luyện */}
      <FlatList
        data={filteredPlans}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: plan }) => (
          <View style={styles.planContainer}>
            <Text style={styles.planTitle}>{plan.name}</Text>
            <FlatList
              horizontal
              data={plan.days}
              keyExtractor={(item) => item.day.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dayCard}
                  onPress={() =>
                    navigation.navigate("WorkoutDetail", {
                      id: plan.id,
                      day: item.day,
                    })
                  }
                >
                  <Text style={styles.dayText}>Ngày {item.day}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      />
    </View>
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
  filterList: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  filterButton: {
    backgroundColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginHorizontal: 5,
    minWidth: 100,
    alignItems: "center",
  },
  activeFilter: {
    backgroundColor: "#1e90ff",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  planContainer: {
    marginBottom: 20,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dayCard: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  dayText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default WorkoutPlanScreen;
