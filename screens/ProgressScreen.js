import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

const ProgressScreen = ({ route }) => {
  const [userId, setUserId] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (route?.params?.userId) {
      setUserId(route.params.userId);
    } else {
      AsyncStorage.getItem("user").then((userData) => {
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.id);
        }
      });
    }
  }, [route]);

  useEffect(() => {
    if (userId) {
      api
        .get(`/progress?userId=${userId}`)
        .then((res) => {
          setProgressData(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Lỗi API:", error);
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );

  if (!progressData.length)
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.noData}>Chưa có dữ liệu tiến trình</Text>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <Text style={styles.title}>Tiến trình cá nhân</Text>

        {/* 🔹 Biểu đồ Cân nặng */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Cân nặng theo ngày (kg)</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            <LineChart
              data={{
                labels: progressData.map((entry) => entry.date),
                datasets: [{ data: progressData.map((entry) => entry.weight) }],
              }}
              width={Math.max(400, screenWidth - 40)}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              bezier
            />
          </ScrollView>
        </View>

        {/* 🔹 Danh sách các chỉ số tiến trình */}
        <Text style={styles.listTitle}>Chi tiết tiến trình</Text>
        {progressData.map((entry) => (
          <View key={entry.id} style={styles.progressCard}>
            <Text style={styles.date}>📅 {entry.date}</Text>
            <Text style={styles.item}>⚖️ Cân nặng: {entry.weight} kg</Text>
            <Text style={styles.item}>🏋️ Vòng ngực: {entry.chest} cm</Text>
            <Text style={styles.item}>🎯 Vòng eo: {entry.waist} cm</Text>
            <Text style={styles.item}>🦵 Vòng đùi: {entry.thigh} cm</Text>
            <Text style={styles.item}>
              ⏳ Thời gian tập: {entry.workoutTime} phút
            </Text>
            <Text style={styles.item}>
              💪 Mức tạ nâng: {entry.liftingWeight} kg
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// 🔹 Cấu hình biểu đồ cân nặng
const chartConfig = {
  backgroundColor: "#1e90ff",
  backgroundGradientFrom: "#1e90ff",
  backgroundGradientTo: "#87cefa",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  horizontalScrollContainer: {
    paddingRight: 20, // Thêm padding để tránh nội dung bị cắt
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 10,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  progressCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    // Thay đổi cách xử lý shadow
    elevation: 3, // Cho Android
    shadowColor: "#000", // Cho iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#007bff",
  },
  item: {
    fontSize: 16,
    marginBottom: 5,
  },
  noData: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
});

export default ProgressScreen;
