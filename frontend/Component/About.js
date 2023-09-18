import { View, Text, StyleSheet, Button } from "react-native";
import React from "react";

export default function About({ navigation }) {
  return (
    <View style={styles.component}>
      <Text style={styles.text}>About Page</Text>
      <Button
        title="Back"
        onPress={() => navigation.navigate("My Dictionary")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  component: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginBottom: 20,
  },
});
