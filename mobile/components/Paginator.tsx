import React, { useMemo } from "react";
import { View, StyleSheet, Animated, useWindowDimensions } from "react-native";

// 1. Vi fortæller TypeScript, at 'data' er en liste (et array)
type PaginatorProps = {
  data: any[]; 
  scrollX: Animated.Value;
};

// 2. Vi bygger komponenten korrekt og sætter typen på
const Paginator = React.memo(({ data, scrollX }: PaginatorProps) => {
    const { width } = useWindowDimensions();
    
    // Memoize dot animations to prevent recalculation on every render
    const dots = useMemo(() => 
      data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });

        return { dotWidth, opacity };
      }), [data.length, width, scrollX]
    );
    
  return (
    <View style={{ flexDirection: "row", height: 20, justifyContent: "center", alignItems: "center" }}>
      {dots.map((dot, i) => (
        <Animated.View style={[styles.dot, { width: dot.dotWidth, opacity: dot.opacity }]} key={i.toString()} />
      ))}
    </View>
  );
});

// 3. Vi eksporterer komponenten i bunden
export default Paginator;

const styles = StyleSheet.create({
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
    marginHorizontal: 6,
    marginBottom: 25,
  },
});