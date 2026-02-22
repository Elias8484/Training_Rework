import React, { useState } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

export default function PhotoTestScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "We need access to your photos to upload them.");
      return;
    }

    // Launch Picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Forces a re-format/crop which handles HEIC conversion
      aspect: [4, 3],
      quality: 0.7,        // Compress slightly for faster uploads
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      
      // Standardizing the file name and type to bypass HEIC restrictions
      const filename = uri.split('/').pop() || 'upload.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append('file', {
        uri: uri,
        name: filename.endsWith('.heic') ? 'image.jpg' : filename,
        type: type === 'image/heic' ? 'image/jpeg' : type,
      } as any);

      const response = await fetch(`${API_BASE}/api/uploads/images`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Image uploaded successfully!");
        console.log("Public URL:", result.publicUrl);
      } else {
        throw new Error(result || "Upload failed");
      }
    } catch (error: any) {
      Alert.alert("Upload Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Photo</Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      
      <Pressable style={styles.button} onPress={pickImage} disabled={uploading}>
        {uploading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Pick & Upload</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  image: { width: 300, height: 300, borderRadius: 10, marginBottom: 20 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, width: '80%', alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});