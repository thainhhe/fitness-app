import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

const BlogSection = ({ navigation }) => {
  const fullText = "How are you feeling today ? Let's share with us !!!";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Blogs
      </Text>
      <View
        style={{
          backgroundColor: "#ffffff",
          padding: 20,
          borderRadius: 15,
          borderWidth: 2,
          borderColor: "#4CAF50",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: "#333",
            textAlign: "center",
            lineHeight: 28,
          }}
        >
          {displayText}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#28a745",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 20,
        }}
        onPress={() => navigation.navigate("Blogs")}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
          Xem Blogs của bạn và mọi người
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BlogSection;