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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tiến trình cá nhân</Text>
      <LineChart
        data={{
          labels: progressData.map((entry) => entry.date),
          datasets: [{ data: progressData.map((entry) => entry.weight) }],
        }}
        width={350}
        height={220}
        chartConfig={{
          backgroundColor: "#1e90ff",
          backgroundGradientFrom: "#1e90ff",
          backgroundGradientTo: "#87cefa",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        style={styles.chart}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  chart: {
    borderRadius: 10,
    alignSelf: "center",
  },
  noData: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
});

export default ProgressScreen;
