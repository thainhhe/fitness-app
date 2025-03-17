import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import api from "../../api";
import { SERVER_URL } from "../../config";
import axios from "axios";

const BlogScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const pickImage = async () => {
    // Yêu cầu quyền truy cập thư viện ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "We need permission to access your media library."
      );
      return;
    }

    // Mở thư viện ảnh với cú pháp mới
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Giảm chất lượng để giảm kích thước file
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      // Chuyển ảnh sang Base64
      convertImageToBase64(result.assets[0].uri);
    } else {
      console.log("User cancelled image picker");
    }
  };

  const convertImageToBase64 = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log("Image converted to Base64");
      setImageBase64(base64);
    } catch (error) {
      console.error("Error converting image to Base64:", error);
      Alert.alert("Error", "Failed to process image. Please try again.");
    }
  };

  const submitBlog = async () => {
    if (!image || !imageBase64) {
      Alert.alert("Error", "Please select an image.");
      return;
    }

    try {
      // Chuẩn bị dữ liệu blog với hình ảnh dạng Base64
      const blogData = {
        title,
        content,
        imageUrl: `data:image/jpeg;base64,${imageBase64}`, // Lưu ảnh dạng Data URL
        createdAt: new Date().toISOString(),
        userId: user?.id,
      };

      // Gửi dữ liệu lên server
      const response = await api.post("/blogs", blogData);

      if (response.status === 201) {
        Alert.alert("Success", "Blog posted successfully!");
        setModalVisible(false);
        // Reset form
        setTitle("");
        setContent("");
        setImage(null);
        setImageBase64(null);
        // Fetch lại danh sách blogs
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error submitting blog:", error.message);
      Alert.alert("Error", "Something went wrong: " + error.message);
    }
  };

  // Hàm lấy thông tin user theo userId
  const fetchUserName = async (userId) => {
    try {
      if (userId === user?.id) return "You";
      const response = await api.get(`/users/${userId}`);
      return response.data?.name || "Unknown";
    } catch (error) {
      console.error(`Failed to fetch user with ID ${userId}:`, error);
      return "Unknown";
    }
  };

  // Hàm lấy danh sách blogs kèm thông tin user
  const fetchBlogs = async () => {
    try {
      const response = await api.get("/blogs");
      const blogs = response.data || [];

      const blogsWithUser = await Promise.all(
        blogs.map(async (blog) => {
          const userName = await fetchUserName(blog.userId);
          return { ...blog, userName };
        })
      );
     
      setBlogs(blogsWithUser);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("user").then((userData) => {
      if (userData) setUser(JSON.parse(userData));
    });
    fetchBlogs();
  }, []);

  return (
    <View style={styles.container}>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalView}
          >
            <ScrollView>
              <Text style={styles.header}>Create a New Blog</Text>

              <TextInput
                style={styles.input}
                placeholder="Enter blog title"
                value={title}
                onChangeText={setTitle}
              />

              <TextInput
                style={[styles.input, styles.contentInput]}
                placeholder="Enter blog content"
                value={content}
                onChangeText={setContent}
                multiline
              />

              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.buttonText}>Select Image</Text>
              </TouchableOpacity>

              {image && (
                <Image
                  source={{ uri: image.uri }}
                  style={styles.imagePreview}
                />
              )}

              <TouchableOpacity
                style={styles.submitButton}
                onPress={submitBlog}
                disabled={!title || !content || !image}
              >
                <Text style={styles.buttonText}>Post Blog</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setTitle("");
                  setContent("");
                  setImage(null);
                  setImageBase64(null);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Create New Blog</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Blogs</Text>
      <FlatList
        data={blogs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.blogItem}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {item.title}
            </Text>
            <Text style={styles.blogContent}>{item.content}</Text>
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.blogImage} />
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.blogDate}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>

              <Text style={styles.blogName}>
                Created By: {item.userName.toUpperCase()}
              </Text>
            </View>
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  contentInput: {
    height: 100,
    textAlignVertical: "top",
  },
  uploadButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 15,
    borderRadius: 5,
  },
  blogImage: {
    width: "100%",
    height: 400,
    borderRadius: 5,
    marginBottom: 10,
    objectFit: "cover",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "green",
  },
  blogItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  blogContent: {
    marginVertical: 10,
  },
  blogDate: {
    fontSize: 12,
    color: "#666",
  },
  blogName: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
  },
});

export default BlogScreen;
