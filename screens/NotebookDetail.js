import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const NotebookDetail = ({ route }) => {
  const { notebook } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={{ uri: notebook.image }} 
        style={styles.image} 
      />
      <Text style={styles.title}>{notebook.title}</Text>
      <Text style={styles.content}>{notebook.content}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,         // Thay vì flex: 1
    padding: 20,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify', // Căn đều văn bản cho đẹp hơn
  },
});

export default NotebookDetail;