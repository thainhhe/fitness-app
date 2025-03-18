import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';

const Notebook = ({ navigation }) => {
  const [notebooks, setNotebooks] = useState([]);

  useEffect(() => {
    fetch('http://192.168.1.6:3001/notebooks')
      .then(response => response.json())
      .then(data => setNotebooks(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const renderNotebook = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('NotebookDetail', { notebook: item })}
      style={styles.cardContainer}
    >
      <ImageBackground
        source={{ uri: item.image }} // URL ảnh background được lấy từ API. Ví dụ: item.image = "https://example.com/image.jpg"
        style={styles.backgroundImage}
        imageStyle={{ borderRadius: 15 }}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notebooks}
        keyExtractor={item => item.id.toString()}
        renderItem={renderNotebook}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  cardContainer: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  backgroundImage: {
    height: 200, // Tăng kích thước card
    justifyContent: 'flex-end',
  },
  textContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Mờ nền để chữ dễ đọc hơn
    padding: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Notebook;
