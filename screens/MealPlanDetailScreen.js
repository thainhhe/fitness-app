import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const MealPlanDetailScreen = ({ route }) => {
  const { mealPlan } = route.params; // Nhận đúng dữ liệu

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mealPlan.name}</Text>
      <Text style={styles.goal}>🎯 Mục tiêu: {mealPlan.goal}</Text>
      <Text style={styles.calories}>🔥 {mealPlan.calories} kcal</Text>
      <Text style={styles.subtitle}>🍽️ Danh sách món ăn:</Text>

      <FlatList
        data={mealPlan.meals}
        keyExtractor={(meal) => meal.name}
        renderItem={({ item }) => (
          <View style={styles.mealCard}>
            <Text style={styles.mealName}>{item.name}</Text>
            <Text style={styles.mealCalories}>🔥 {item.calories} kcal</Text>
          </View>
        )}
      />
    </View>
  );
};

// ✅ Thêm styles để tránh lỗi ReferenceError
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  goal: {
    fontSize: 16,
    color: "#007bff",
    marginBottom: 5,
  },
  calories: {
    fontSize: 16,
    color: "#28a745",
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mealCard: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  mealCalories: {
    fontSize: 14,
    color: "#d9534f",
  },
});

export default MealPlanDetailScreen;
