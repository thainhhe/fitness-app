import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Modal,
  Image,
  FlatList,
} from "react-native";
import { useEffect, useState } from "react";
import api from "../api";

const BMIScreen = ({ route, navigation }) => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");

  const [bmi, setBmi] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [mealPlans, setMealPlans] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    getBmiPlans();
  }, []);

  const getBmiPlans = () => {
    api.get("/bmiGuides").then((res) => {
      if (res && res.data) {
        setPlans(res.data);
      }
    });
  };

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h && w) {
      const calculatedBmi = (w / (h * h)).toFixed(1);
      setBmi(calculatedBmi);
      suggestMealPlans(calculatedBmi);
    }
  };

  const handleNumericInput = (text, setter) => {
    const numericText = text.replace(/[^0-9.]/g, ""); // Chỉ giữ lại số và dấu chấm
    setter(numericText);
  };

  const suggestMealPlans = (bmiValue) => {
    const suggested = plans.filter((plan) => {
      const range = plan.bmiRange;

      if (range.includes("-")) {
        const [min, max] = range.split("-").map(Number);
        return bmiValue >= min && bmiValue <= max;
      } else if (range.includes("<")) {
        const max = parseFloat(range.replace("<", ""));
        return bmiValue < max;
      } else if (range.includes("≥")) {
        const min = parseFloat(range.replace("≥", ""));
        return bmiValue >= min;
      }

      return false;
    });
    setMealPlans(suggested);
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>BMI là gì?</Text>
            {/* formula */}
            <View style={styles.formulaContainer}>
              <Text style={styles.formulaText}>BMI = </Text>
              <View style={styles.fraction}>
                <Text style={styles.numerator}>cân nặng (kg)</Text>
                <View style={styles.divider} />
                <Text style={styles.denominator}>(chiều cao (m))²</Text>
              </View>
            </View>

            {/* details */}
            <View style={{ alignItems: "flex-start", marginTop: 10 }}>
              <Text>
                Dưới 18.5:{" "}
                <Text style={{ color: "red", fontWeight: "bold" }}>Gầy</Text>
              </Text>
              <Text>
                18.5 tới 24.9:{" "}
                <Text style={{ color: "green", fontWeight: "bold" }}>
                  Bình thường
                </Text>
              </Text>
              <Text>
                25 tới 29.9:{" "}
                <Text style={{ color: "orange", fontWeight: "bold" }}>
                  Thừa cân
                </Text>
              </Text>
              <Text>
                30+:{" "}
                <Text style={{ color: "purple", fontWeight: "bold" }}>
                  Béo phì
                </Text>
              </Text>
            </View>
            <Image
              source={{
                uri: "https://th.bing.com/th/id/OIP.-QVjNIMZtFVNGJLW1HrzaAHaFP",
              }}
              style={styles.modalImage}
            />
            <Button title="Đóng" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <Text style={styles.title}>Tính BMI của bạn</Text>
      <TextInput
        style={styles.input}
        placeholder="Chiều cao (cm)"
        value={height}
        onChangeText={(text) => handleNumericInput(text, setHeight)} // Sử dụng hàm lọc
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Cân nặng (kg)"
        value={weight}
        onChangeText={(text) => handleNumericInput(text, setWeight)} // Sử dụng hàm lọc
        keyboardType="numeric"
      />
      <Button title="Tính BMI" onPress={calculateBMI} />
      {bmi && <Text style={styles.result}>BMI của bạn: {bmi}</Text>}
      {mealPlans.length > 0 && (
        <FlatList
          data={mealPlans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.mealPlanContainer}>
              <Text style={styles.mealPlanTitle}>{item.name}</Text>
              {item.meals.map((meal, index) => (
                <View key={index} style={styles.mealItem}>
                  <Text style={styles.mealName}>- {meal.name}</Text>
                  <Text style={styles.mealRecipe}>{meal.recipe}</Text>
                </View>
              ))}
            </View>
          )}
          style={styles.mealPlanList}
        />
      )}
      <View style={{ marginTop: 20 }}>
        <Button
          title="Xem giải thích BMI"
          onPress={() => setModalVisible(true)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  result: {
    fontSize: 18,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalImage: {
    width: 200,
    height: 150,
    marginVertical: 10,
  },
  mealPlan: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  // Thêm kiểu cho công thức BMI
  formulaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  formulaText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  fraction: {
    alignItems: "center",
    marginLeft: 5,
  },
  numerator: {
    fontSize: 16,
    paddingBottom: 5,
  },
  divider: {
    width: 80,
    height: 1,
    backgroundColor: "#000",
  },
  denominator: {
    fontSize: 16,
    paddingTop: 5,
  },

  //   meal css
  mealPlanList: {
    marginTop: 20,
  },
  mealPlanContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Hiệu ứng nổi cho Android
  },
  mealPlanTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  mealItem: {
    marginBottom: 10,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#34495e",
  },
  mealRecipe: {
    fontSize: 14,
    color: "#7f8c8d",
    marginLeft: 10,
    lineHeight: 20,
  },
});

export default BMIScreen;
