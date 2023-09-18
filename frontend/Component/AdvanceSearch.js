import Voice from "@react-native-community/voice";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";

export default function AdvanceSearch() {
  const [voiceText, setVoiceText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // Set up event listeners for speech recognition events
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      // Clean up event listeners when component unmounts
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e) => {
    setIsRecording(true);
  };

  const onSpeechRecognized = (e) => {};

  const onSpeechResults = (e) => {
    const recognizedText = e.value[0]; // Get the first recognized result
    setVoiceText(recognizedText);
    setIsRecording(false);
  };

  const startVoiceRecognition = async () => {
    console.error("Speech Recognition ");
    setVoiceText(""); // Clear any previous recognized text
    try {
      await Voice.start("en-US", {
        REQUEST_PERMISSIONS_AUTO: true, // Disable automatic permission popup
      });
    } catch (error) {
      console.error("Speech Recognition Error: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.voiceSearch}>
          <TouchableOpacity
            style={styles.voiceIconbg}
            onPress={startVoiceRecognition}
            disabled={isRecording}
          >
            <Icon name="volume-down" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.voiceText}>
            {isRecording ? "Listening..." : " "}
          </Text>
        </View>
        <View style={styles.imageSearch}>
          <TouchableOpacity style={styles.imageIconbg}>
            <Icon name="image" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.imageText}>Search with Image</Text>
        </View>
      </View>
      <View style={styles.meaningContainer}>
        <View style={styles.wordContainer}>
          <Text style={styles.wordText}>Apple</Text>
        </View>
        <Text style={styles.posTagging}>Verb</Text>
        <Text style={styles.wordResult}>{voiceText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(224, 224, 121, 1)",
    height: "100%",
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  searchContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  voiceSearch: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    paddingHorizontal: 40,
    paddingVertical: 11,
    borderRadius: 20,
    fontSize: 20,
    backgroundColor: "rgba(255, 255, 224, 1)",
    elevation: 5,
    shadowColor: "#52006A",
  },
  voiceIconbg: {
    backgroundColor: "rgba(219, 219, 212, 0.8)",
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 20,
  },
  voiceText: {
    fontSize: 19,
    paddingLeft: 30,
    fontWeight: "700",
    color: "rgba(120, 120, 120, 0.97)",
  },

  imageSearch: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 224, 1)",
    elevation: 5,
    shadowColor: "#52006A",
  },
  imageIconbg: {
    backgroundColor: "rgba(219, 219, 212, 0.8)",
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 20,
  },

  imageText: {
    fontSize: 19,
    paddingLeft: 27,
    fontWeight: "700",
    color: "rgba(120, 120, 120, 0.97)",
  },
  meaningContainer: {
    marginTop: 50,
    height: 220,
    backgroundColor: "rgba(255, 255, 224, 1)",
    borderRadius: 5,
    elevation: 5,
    shadowColor: "#52006A",
  },
  wordContainer: {
    backgroundColor: "rgba(57, 57, 1, 1)",
    width: "100%",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 5,
    elevation: 5,
    shadowColor: "#52006A",
    elevation: 5,
    shadowColor: "#52006A",
  },
  wordText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  posTagging: {
    paddingTop: 8,
    paddingHorizontal: 15,
    fontSize: 20,
  },
  wordResult: {
    paddingTop: 15,
    paddingHorizontal: 12,
    fontSize: 18,
    fontWeight: "400",
  },
});
