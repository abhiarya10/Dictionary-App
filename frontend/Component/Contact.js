import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function Contact() {
  return (
    <View style={styles.component}>
      <Text>Contact Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  component: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
