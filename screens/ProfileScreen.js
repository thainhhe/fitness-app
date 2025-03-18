import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActionSheetIOS,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../api"; // API call từ server
import Icon from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = ({ route }) => {
  const { userId } = route.params; // Nhận userId từ navigation
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("photos");
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [age, setAge] = useState(null);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/users/${userId}`);
        setUser(response.data);

        // Đặt editedProfile chính xác, tách name ra ngoài
        setEditedProfile({
          name: response.data.name, // Name nằm ngoài userProfile
          ...response.data.userProfile, // Giữ lại các dữ liệu trong userProfile
        });

        setAvatar(response.data.userProfile?.avatar || "");

        if (response.data.userProfile?.dob) {
          const [year, month, day] = response.data.userProfile.dob.split("-");
          setSelectedDay(day);
          setSelectedMonth(month);
          setSelectedYear(year);
        }
      } catch (error) {
        console.error("Lỗi khi tải user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);




  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());


  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYear) {
      setEditedProfile((prev) => ({
        ...prev,
        dob: `${selectedYear}-${selectedMonth.padStart(2, "0")}-${selectedDay.padStart(2, "0")}`,
      }));
    }
  }, [selectedDay, selectedMonth, selectedYear]);
  useEffect(() => {
    if (user?.userProfile?.dob) {
      setAge(calculateAge(user.userProfile.dob));
    }
  }, [user]);

  const handleSave = async () => {
    if (!selectedDay || !selectedMonth || !selectedYear) {
      Alert.alert("Lỗi", "Vui lòng chọn đầy đủ ngày sinh!");
      return;
    }

    const formattedDOB = `${selectedYear}-${selectedMonth.padStart(2, "0")}-${selectedDay.padStart(2, "0")}`;
    const calculatedAge = calculateAge(formattedDOB);

    try {
      const updatedData = {
        ...user,
        name: editedProfile.name, // Cập nhật tên riêng
        userProfile: {
          ...user.userProfile,
          ...editedProfile, // Cập nhật thông tin profile
          dob: formattedDOB,
          age: calculatedAge,
        },
      };

      const response = await api.put(`/users/${userId}`, updatedData);

      setUser(response.data); // Cập nhật state ngay lập tức
      setEditMode(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };





  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }
  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  if (!user) return <Text>Lỗi tải dữ liệu!</Text>;

  const calculateAge = (dob) => {
    if (!dob) return null; // Trả về null nếu không có ngày sinh

    const dobDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const dayDiff = today.getDate() - dobDate.getDate();

    // Nếu chưa đến sinh nhật trong năm hiện tại, giảm tuổi đi 1
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };



  const handleImagePicker = () => {
    if (Platform.OS === "ios") {
      // Hiển thị menu trên iOS
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Chụp ảnh", "Chọn ảnh từ thư viện", "Hủy"],
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) openCamera();
          if (buttonIndex === 1) openGallery();
        }
      );
    } else {
      // Hiển thị menu trên Android & iOS
      Alert.alert("Chọn ảnh", "Bạn muốn làm gì?", [
        { text: "Chụp ảnh", onPress: openCamera },
        { text: "Chọn ảnh từ thư viện", onPress: openGallery },
        { text: "Hủy", style: "cancel" },
      ]);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Cần quyền truy cập", "Hãy cấp quyền sử dụng camera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setEditedProfile((prev) => ({ ...prev, avatar: result.assets[0].uri }));
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Cần quyền truy cập", "Hãy cấp quyền truy cập thư viện.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setEditedProfile((prev) => ({ ...prev, avatar: result.assets[0].uri }));
    }
  };
  const handleGenderPicker = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Nam", "Nữ", "Khác", "Hủy"],
          cancelButtonIndex: 3,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) setEditedProfile({ ...editedProfile, gender: "Male" });
          if (buttonIndex === 1) setEditedProfile({ ...editedProfile, gender: "Female" });
          if (buttonIndex === 2) setEditedProfile({ ...editedProfile, gender: "Other" });
        }
      );
    } else {
      Alert.alert("Chọn giới tính", "Bạn muốn chọn giới tính nào?", [
        { text: "Nam", onPress: () => setEditedProfile({ ...editedProfile, gender: "Male" }) },
        { text: "Nữ", onPress: () => setEditedProfile({ ...editedProfile, gender: "Female" }) },
        { text: "Khác", onPress: () => setEditedProfile({ ...editedProfile, gender: "Other" }) },
        { text: "Hủy", style: "cancel" },
      ]);
    }
  };

  const handleBackPress = () => {
    Alert.alert(
      "Bạn có chắc chắn?",
      "Bạn có muốn tiếp tục chỉnh sửa hay bỏ lưu thay đổi?",
      [
        { text: "Tiếp tục chỉnh sửa", style: "cancel" },
        {
          text: "Bỏ lưu & Quay lại",
          onPress: () => navigation.goBack(),
          style: "destructive"
        }
      ]
    );
  };
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Profile của tôi</Text>
            <TouchableOpacity onPress={() => setEditMode(true)}>
              <Icon name="create-outline" size={24} color="black" />
            </TouchableOpacity>

          </View>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image
              source={
                user.userProfile?.avatar
                  ? { uri: user.userProfile.avatar }
                  : user.userProfile?.gender === "female"
                    ? require("../assets/avatar-female.png")
                    : require("../assets/avatar-male.png")
              }
              style={styles.avatar}
            />
          </View>
          {/* Thông tin User */}
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.age}>Tuổi: {age || "Chưa cập nhật"}</Text>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={activeTab === "photos" ? styles.activeTab : styles.inactiveTab}
              onPress={() => setActiveTab("photos")}
            >
              <Text style={activeTab === "photos" ? styles.activeTabText : styles.inactiveTabText}>Ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={activeTab === "info" ? styles.activeTab : styles.inactiveTab}
              onPress={() => setActiveTab("info")}
            >
              <Text style={activeTab === "info" ? styles.activeTabText : styles.inactiveTabText}>Thông tin</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inactiveTab}>
              <Text style={styles.inactiveTabText}>Feeds</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            {activeTab === "photos" && (
              <View style={styles.addPhotoContainer}>
                <Icon name="camera-outline" size={50} color="#D3D3D3" />
                <Text style={styles.addPhotoText}>
                  Để thêm ảnh, hãy nhấn vào "+",
                </Text>
                <Text style={styles.addPhotoText}>
                  để xóa, hãy nhấn vào ảnh
                </Text>
              </View>
            )}

            {activeTab === "info" && (
              <View style={styles.infoSection}>
                <TouchableOpacity style={styles.infoItem}>
                  <Icon name="person-outline" size={20} color="#666" />
                  <Text style={styles.infoText}>Về tôi: {user?.userProfile?.bio || "Chưa cập nhật"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.infoItem}>
                  <Icon name="briefcase-outline" size={20} color="#666" />
                  <Text style={styles.infoText}>Nghề nghiệp: {user?.userProfile?.job || "Chưa cập nhật"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.infoItem}>
                  <Icon name="flag-outline" size={20} color="#666" />
                  <Text style={styles.infoText}>Mục tiêu thể thao: {user?.userProfile?.fitnessGoal || "Chưa cập nhật"}</Text>
                </TouchableOpacity>
              </View>
            )}


            {/* {activeTab === "feeds" && (
          <Text style={styles.contentText}>Feeds của người dùng...</Text>
        )} */}
          </View>
          <Modal visible={editMode} animationType="slide" transparent>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
              <ScrollView contentContainerStyle={styles.modalContent}>
                {/* Nút quay lại */}
                <TouchableOpacity onPress={handleBackPress} style={styles.closeButton}>
                  <Text style={styles.closeText}>⬅</Text>
                </TouchableOpacity>

                {/* Tiêu đề */}
                <Text style={styles.title}>Chỉnh sửa profile</Text>

                {/* Ảnh đại diện */}
                <TouchableOpacity onPress={handleImagePicker} style={styles.avatarContainer}>
                  <Image
                    source={
                      editedProfile.avatar
                        ? { uri: editedProfile.avatar }
                        : user?.userProfile?.gender === "female"
                          ? require("../assets/avatar-female.png")
                          : require("../assets/avatar-male.png")
                    }
                    style={styles.avatar}
                  />
                  <Text style={styles.editAvatarText}>Chỉnh sửa ảnh đại diện</Text>
                </TouchableOpacity>

                {/* Nhập tên */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Tên</Text>
                  <TextInput
                    value={editedProfile.name}
                    onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, name: text }))}
                    style={styles.textInput}
                  />
                </View>

                {/* Chọn giới tính */}
                <Text style={styles.label}>Giới tính</Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    onPress={() => setEditedProfile({ ...editedProfile, gender: "Male" })}
                    style={[styles.genderButton, editedProfile.gender === "Male" && styles.genderButtonSelected]}
                  >
                    <Text style={styles.genderText}>Nam</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setEditedProfile({ ...editedProfile, gender: "Female" })}
                    style={[styles.genderButton, editedProfile.gender === "Female" && styles.genderButtonSelected]}
                  >
                    <Text style={styles.genderText}>Nữ</Text>
                  </TouchableOpacity>
                </View>

                {/* Chọn ngày sinh */}
                <Text style={styles.label}>Ngày sinh</Text>
                <View style={styles.datePickerContainer}>
                  {/* Ô chọn Ngày */}
                  <TouchableOpacity onPress={() => setShowPicker("day")} style={styles.pickerButton}>
                    <Text>{selectedDay}</Text>
                  </TouchableOpacity>

                  {/* Ô chọn Tháng */}
                  <TouchableOpacity onPress={() => setShowPicker("month")} style={styles.pickerButton}>
                    <Text>{selectedMonth}</Text>
                  </TouchableOpacity>

                  {/* Ô chọn Năm */}
                  <TouchableOpacity onPress={() => setShowPicker("year")} style={styles.pickerButton}>
                    <Text>{selectedYear}</Text>
                  </TouchableOpacity>
                </View>

                {/* Modal chọn Ngày */}
                {showPicker === "day" && (
                  <Modal transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                      <Picker selectedValue={selectedDay} onValueChange={(item) => setSelectedDay(item)}>
                        {days.map((day) => (
                          <Picker.Item key={day} label={day} value={day} />
                        ))}
                      </Picker>
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => setShowPicker(null)} style={styles.cancelButton}>
                          <Text>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowPicker(null)} style={styles.saveButton}>
                          <Text>Lưu</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                )}

                {/* Modal chọn Tháng */}
                {showPicker === "month" && (
                  <Modal transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                      <Picker selectedValue={selectedMonth} onValueChange={(item) => setSelectedMonth(item)}>
                        {months.map((month) => (
                          <Picker.Item key={month} label={month} value={month} />
                        ))}
                      </Picker>
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => setShowPicker(null)} style={styles.cancelButton}>
                          <Text>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowPicker(null)} style={styles.saveButton}>
                          <Text>Lưu</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                )}

                {/* Modal chọn Năm */}
                {showPicker === "year" && (
                  <Modal transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                      <Picker selectedValue={selectedYear} onValueChange={(item) => setSelectedYear(item)}>
                        {years.map((year) => (
                          <Picker.Item key={year} label={year} value={year} />
                        ))}
                      </Picker>
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => setShowPicker(null)} style={styles.cancelButton}>
                          <Text>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowPicker(null)} style={styles.saveButton}>
                          <Text>Lưu</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                )}

                {/* Nhập nghề nghiệp */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Nghề nghiệp</Text>
                  <TextInput
                    value={editedProfile.job}
                    onChangeText={(text) => setEditedProfile({ ...editedProfile, job: text })}
                    style={styles.textInput}
                  />
                </View>

                {/* Nhập mục tiêu thể thao */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Mục tiêu thể thao</Text>
                  <TextInput
                    value={editedProfile.fitnessGoal}
                    onChangeText={(text) => setEditedProfile({ ...editedProfile, fitnessGoal: text })}
                    style={styles.textInput}
                  />
                </View>

                {/* Nhập tiểu sử */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Tiểu sử</Text>
                  <TextInput
                    value={editedProfile.bio}
                    onChangeText={(text) => setEditedProfile({ ...editedProfile, bio: text })}
                    style={styles.textInput}
                    multiline
                  />
                </View>

                {/* Nút Lưu và Hủy */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => setEditMode(false)} style={styles.cancelButton}>
                    <Text style={styles.buttonText}>Bỏ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (!editedProfile.dob) {
                        Alert.alert("Lỗi", "Vui lòng chọn ngày sinh!");
                        return;
                      }
                      handleSave();
                    }}
                    style={styles.saveButton}
                  >
                    <Text style={styles.buttonText}>Lưu</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </Modal>





          {/* Nút thêm ảnh */}
          <TouchableOpacity style={styles.addButton}>
            <Icon name="add" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center" },
  header: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
  },
  headerText: { fontSize: 18, fontWeight: "bold" },
  avatarContainer: { marginTop: 20, alignItems: "center" },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  age: { fontSize: 16, color: "#666" },
  tabContainer: { flexDirection: "row", marginTop: 20 },
  activeTab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#003366",
    marginHorizontal: 5,
  },
  activeTabText: { fontSize: 16, fontWeight: "bold", color: "#003366" },
  inactiveTab: { padding: 10, marginHorizontal: 5 },
  inactiveTabText: { fontSize: 16, color: "#999" },
  addPhotoContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  infoSection: {
    width: "90%",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },

  addPhotoText: { color: "#999", textAlign: "center", marginTop: 10 },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#007AFF",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",

  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "100%",
  },
  closeButton: {
    alignSelf: "flex-start",
    padding: 10,
  },
  closeText: {
    fontSize: 22,
    color: "gray",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  editAvatarText: {
    color: "blue",
    marginTop: 5,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  genderButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  genderButtonSelected: {
    backgroundColor: "#0080ff",
    borderColor: "#0073e6",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  pickerButton: { padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, width: "30%", alignItems: "center" },
  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(243, 238, 238, 0.5)" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  cancelButton: { padding: 10, backgroundColor: "red", borderRadius: 5 },
  saveButton: { padding: 10, backgroundColor: "blue", borderRadius: 5 },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfileScreen;
