import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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

  const goalOptions = [
    { goal: null, name: "Tất cả" },
    ...[
      "Tăng cơ",
      "Giảm cân",
      "Duy trì thể lực",
      "Phát triển cơ vai và tay",
      "Tăng sức mạnh tổng thể",
    ].map((goal) => ({ goal, name: goal })),
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chương trình tập luyện</Text>

      {/* Bộ lọc mục tiêu */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          {goalOptions.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.filterButton,
                selectedGoal === item.goal && styles.activeFilter,
              ]}
              onPress={() => setSelectedGoal(item.goal)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedGoal === item.goal
                    ? styles.activeFilterText
                    : styles.inactiveFilterText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Danh sách chương trình tập luyện */}
      <FlatList
        contentContainerStyle={styles.plansContainer}
        data={filteredPlans}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: plan }) => (
          <View style={styles.planContainer}>
            <Text style={styles.planTitle}>{plan.name}</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Không có chương trình tập luyện nào
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  filterContainer: {
    marginBottom: 16, // Giảm khoảng cách giữa bộ lọc và danh sách
  },
  filterList: {
    paddingVertical: 4,
  },
  filterButton: {
    backgroundColor: "#e9ecef",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    width: 100,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  activeFilter: {
    backgroundColor: "#1e90ff",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  activeFilterText: {
    color: "#fff",
  },
  inactiveFilterText: {
    color: "#333",
  },
  plansContainer: {
    paddingTop: 0, // Không có khoảng trống ở đầu
  },
  planContainer: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  dayCard: {
    backgroundColor: "#1e90ff",
    padding: 14,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 90,
    alignItems: "center",
  },
  dayText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6c757d",
  },
});

export default WorkoutPlanScreen;
