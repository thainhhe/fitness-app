import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import api from "../api";

// Cấu hình thông báo để hiển thị ngay cả khi ứng dụng chạy nền
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const ReminderScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [time, setTime] = useState(new Date());
  const [days, setDays] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    registerForPushNotifications();
    fetchSchedules();
  }, []);

  // 📌 Xin quyền thông báo từ hệ thống
  const registerForPushNotifications = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        Alert.alert("Lỗi", "Bạn cần cấp quyền thông báo để sử dụng tính năng này.");
      }
    }
  };

  // 📌 Lên lịch thông báo dựa trên ngày giờ đã chọn
  const scheduleNotification = async (hour, minute, selectedDays, id) => {
  console.log("Scheduling notifications for:", hour, minute, selectedDays);

  for (const day of selectedDays) {
    const now = new Date();
    let notificationDate = new Date();
    
    // Đặt ngày gần nhất phù hợp với `selectedDays`
    notificationDate.setHours(hour, minute, 0, 0); // Giữ nguyên giờ/phút/giây/millisecond

    // Xác định khoảng cách tới ngày tập gần nhất
    const today = now.getDay(); // Lấy thứ hiện tại (0 = Chủ Nhật, 6 = Thứ Bảy)
    let daysUntilNextWorkout = (day - today + 7) % 7;
    if (daysUntilNextWorkout === 0 && now > notificationDate) {
      // Nếu hôm nay là ngày tập nhưng giờ đã qua, đặt vào tuần sau
      daysUntilNextWorkout = 7;
    }

    // Cộng số ngày cần thiết để đặt lịch
    notificationDate.setDate(notificationDate.getDate() + daysUntilNextWorkout);

    console.log("Trigger Date:", notificationDate);

    await Notifications.scheduleNotificationAsync({
      identifier: `${id}-${day}`,
      content: {
        title: "Nhắc nhở tập luyện 💪",
        body: `Đã đến giờ tập luyện: ${name}!`,
        sound: "default",
      },
      trigger: notificationDate, // Chạy vào ngày giờ chính xác
    });
  }
};



  // 📌 Lấy danh sách lịch nhắc đã lưu từ API
  const fetchSchedules = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (!user) return;
      const userId = JSON.parse(user).id;
      const response = await api.get(`/workoutSchedules?userId=${userId}`);
      setSchedules(response.data);
    } catch (error) {
      console.error("Lỗi khi tải lịch hẹn giờ:", error);
    }
  };

  // 📌 Lưu lịch tập mới
  const saveSchedule = async () => {
    if (!name.trim() || days.length === 0) {
      Alert.alert("Lỗi", "Vui lòng nhập tên lịch tập và chọn ít nhất một ngày!");
      return;
    }

    try {
      const user = await AsyncStorage.getItem("user");
      if (!user) return;
      const userId = JSON.parse(user).id;
      const newSchedule = { userId, name, time: time.toTimeString().slice(0, 5), days };
      const response = await api.post("/workoutSchedules", newSchedule);

      await scheduleNotification(time.getHours(), time.getMinutes(), days, response.data.id);
      Alert.alert("Thành công", "Lịch hẹn giờ đã được tạo!");
      setName("");
      setDays([]);
      fetchSchedules();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu lịch hẹn giờ, vui lòng thử lại.");
    }
  };

  // 📌 Xóa lịch hẹn và hủy thông báo
  const deleteSchedule = async (id, days) => {
    try {
        await api.delete(`/workoutSchedules/${id}`);

        // Hủy tất cả thông báo liên quan đến lịch này
        for (const day of days) {
            await Notifications.cancelScheduledNotificationAsync(`${id}-${day}`);
        }

        Alert.alert("Thành công", "Đã xóa lịch nhắc nhở.");
        setSchedules(schedules.filter((item) => item.id !== id));
    } catch (error) {
        Alert.alert("Lỗi", "Không thể xóa lịch nhắc nhở.");
    }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt lịch nhắc tập luyện</Text>
      <TextInput placeholder="Tên lịch tập" style={styles.input} onChangeText={setName} value={name} />
      <TouchableOpacity style={styles.timeButton} onPress={() => setShowTimePicker(true)}>
        <Text style={styles.timeButtonText}>Chọn giờ</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}
      <Text style={styles.timeText}>Giờ: {time.toTimeString().slice(0, 5)}</Text>
      <Text style={styles.label}>Chọn ngày trong tuần:</Text>
      <View style={styles.daysContainer}>
        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dayButton, days.includes(index) ? styles.dayButtonSelected : {}]}
            onPress={() =>
              setDays((prevDays) =>
                prevDays.includes(index) ? prevDays.filter((d) => d !== index) : [...prevDays, index]
              )
            }
          >
            <Text style={[styles.dayButtonText, days.includes(index) ? styles.dayButtonTextSelected : {}]}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={saveSchedule}>
        <Text style={styles.saveButtonText}>Lưu</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Lịch đã đặt</Text>
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.scheduleItem}>
            <Text>
              {item.name} - {item.time} ({item.days.map(d => ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][d]).join(", ")})
            </Text>
            <TouchableOpacity onPress={() => deleteSchedule(item.id, item.days)}>
              <Text style={styles.deleteText}>Xóa</Text>
            </TouchableOpacity>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  timeButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  timeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  timeText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#007bff",
    backgroundColor: "#fff",
  },
  dayButtonSelected: {
    backgroundColor: "#007bff",
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007bff",
  },
  dayButtonTextSelected: {
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#e9ecef",
    marginVertical: 5,
  },
  deleteText: {
    color: "#dc3545",
    fontWeight: "bold",
  },
});

export default ReminderScreen;
