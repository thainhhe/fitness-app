import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const NotebookDetail = ({ route }) => {
  const { notebook } = route.params;

  return (
    <View style={styles.container}>
       <Image 
        source={{ uri: notebook.image }} 
        style={styles.image} 
      />
      <Text style={styles.title}>{notebook.title}</Text>
      <Text style={styles.content}>{notebook.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
});

export default NotebookDetail;
