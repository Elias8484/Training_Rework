import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE;
const COLUMN_COUNT = 2;
const { width } = Dimensions.get('window');
const TILE_SIZE = (width - 3) / COLUMN_COUNT;

type ImageItem = { id: number; fileName: string; publicUrl: string };

export default function AllImagesScreen() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ImageItem | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/uploads/images`)
      .then((r) => r.json())
      .then(setImages)
      .catch(() => setError('Failed to load images.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (images.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No images uploaded yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item) => String(item.id)}
        numColumns={COLUMN_COUNT}
        renderItem={({ item }) => (
          <Pressable onPress={() => setSelected(item)}>
            <Image source={{ uri: item.publicUrl }} style={styles.tile} />
          </Pressable>
        )}
        contentContainerStyle={styles.grid}
      />

      <Modal visible={!!selected} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={() => setSelected(null)}>
          {selected && (
            <Image
              source={{ uri: selected.publicUrl }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  grid: { gap: 1 },
  tile: { width: TILE_SIZE, height: TILE_SIZE },
  errorText: { color: 'red', fontSize: 16 },
  emptyText: { fontSize: 16, color: '#666' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullImage: { width: width, height: width },
});
