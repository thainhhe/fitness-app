import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import api from "../api";

const NutritionSuggestionScreen = ({ navigation }) => {
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null); // Lọc theo mục tiêu

  useEffect(() => {
    api
      .get("/mealPlans")
      .then((res) => {
        console.log("Fetched nutrition plans:", res.data);
        setNutritionPlans(res.data);
      })
      .catch((error) => console.error("Error fetching nutrition plans:", error));
  }, []);

  // Lọc theo mục tiêu (nếu có chọn)
  const filteredPlans = selectedGoal
    ? nutritionPlans.filter((plan) => plan.goal === selectedGoal)
    : nutritionPlans;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gợi ý dinh dưỡng</Text>

      {/* Bộ lọc mục tiêu */}
      <FlatList
        horizontal
        data={[
          { goal: null, name: "Tất cả" },
          ...["Tăng cơ", "Giảm cân", "Duy trì sức khỏe"].map((goal) => ({
            goal,
            name: goal,
          })),
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

      {/* Danh sách kế hoạch dinh dưỡng */}
      <FlatList
        data={filteredPlans}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: plan }) => (
          <TouchableOpacity
            style={styles.planContainer}
            onPress={() =>
                navigation.navigate("NutritionDetailScreen", { mealPlan: plan })
            }
          >
            <Text style={styles.planTitle}>{plan.name}</Text>
            <Text style={styles.planDescription}>{plan.description}</Text>
          </TouchableOpacity>
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
    backgroundColor: "#28a745",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  planContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  planDescription: {
    fontSize: 14,
    color: "#666",
  },
});

export default NutritionSuggestionScreen;
