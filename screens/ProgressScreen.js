import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  if (loading) return <ActivityIndicator size="large" color="blue" />;
  if (!progressData.length)
    return <Text style={styles.noData}>Chưa có dữ liệu tiến trình</Text>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Tiến trình cá nhân</Text>

        {/* 🔹 Biểu đồ Cân nặng */}
        <Text style={styles.chartTitle}>Cân nặng theo ngày (kg)</Text>
        <LineChart
          data={{
            labels: progressData.map((entry) => entry.date),
            datasets: [{ data: progressData.map((entry) => entry.weight) }],
          }}
          width={350}
          height={200}
          chartConfig={chartConfig}
          style={styles.chart}
        />

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
    </View>
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
    flex: 1, // 🔹 Giữ bố cục toàn màn hình
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1, // 🔹 Đảm bảo nội dung cuộn toàn màn hình
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  progressCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
