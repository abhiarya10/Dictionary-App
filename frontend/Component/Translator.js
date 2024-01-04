import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import * as Clipboard from "expo-clipboard";

import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Translator() {
  const [selectedLanguage, setSelecteLanguage] = useState("en");
  const [input, setInput] = useState("");
  const [translatedResult, setTranslatedResult] = useState("");
  const [copiedData, setCopiedData] = useState("");

  function inputHandler(e) {
    setInput(e.trim());
  }

  function copyHandler() {
    if (translatedResult) {
      Clipboard.setStringAsync(translatedResult);
      setCopiedData(translatedResult);
    }
  }

  function clearInputHandler() {
    setInput("");
  }

  function translateHandler() {
    if (input) {
      const translateData = {
        target_language: selectedLanguage,
        sentence: input,
      };

      fetch(
        "https://70a6-2402-e280-3e4b-4e2-c039-a1ec-ab60-d01b.ngrok-free.app/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(translateData),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setTranslatedResult(data.translated_sentence);
          setCopiedData(""); // Reset copied data when translation changes
        })
        .catch((error) => {
          console.error("Translation Error:", error);
        });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Translator</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputStyle}
          onChangeText={inputHandler}
          defaultValue={input}
          placeholder="Type sentence"
        />
        <TouchableOpacity
          style={styles.clearInputBtn}
          onPress={clearInputHandler}
        >
          <Icon name="times" size={22} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.pickerView}>
        <View style={styles.pickerDestination}>
          <Text style={styles.pickerDestinationText}>Translate to</Text>
        </View>
        <Text>---</Text>

        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue, itemIndex) =>
            setSelecteLanguage(itemValue)
          }
          style={styles.picker}
          dropdownIconColor="red"
          dropdownIconRippleColor="red"
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Hindi" value="hi" />
          <Picker.Item label="Sanskrit" value="sa" />
          <Picker.Item label="Chinese" value="zh-cn" />
          <Picker.Item label="Marathi" value="mr" />
          <Picker.Item label="Tibetan" value="ti" />
        </Picker>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={translateHandler}
        >
          <Text style={styles.textButton}>Translate</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.result} selectable={true}>
          {translatedResult}
        </Text>
      </View>

      <View style={styles.copyView}>
        <TouchableOpacity style={styles.copyContainer} onPress={copyHandler}>
          {copiedData ? (
            <Text style={styles.copyText}>Copied</Text>
          ) : (
            <Text style={styles.copyText}>Copy</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    padding: 25,
    backgroundColor: "rgba(224, 224, 121, 1)",
  },
  headerText: {
    marginTop: 40,
    fontSize: 30,
    letterSpacing: 1,
    fontWeight: "700",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 40,
    borderBottomWidth: 2,
    borderColor: "rgba(57, 57, 1, 1)",
    backgroundColor: "rgba(255, 255, 224, 1)",
    borderRadius: 5,
    elevation: 5,
    shadowColor: "#171717",
  },

  inputStyle: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 20,
  },

  clearInputBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  picker: {
    width: "43%",
    height: 50,
  },
  pickerView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "rgba(255, 255, 224, 1)",
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 40,
    elevation: 5,
    shadowColor: "#171717",
  },
  pickerDestinationText: {
    fontSize: 17,
    fontWeight: "400",
  },
  searchContainer: {
    width: "100%",
  },

  searchButton: {
    width: "35%",
    padding: 13,
    alignItems: "center",
    backgroundColor: "rgba(57, 57, 1, 1)",
    borderRadius: 3,
    elevation: 5,
    shadowColor: "#171717",
  },
  textButton: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  resultContainer: {
    width: "100%",
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 224, 1)",
    marginTop: 40,
    paddingHorizontal: 15,
    paddingVertical: 20,
    elevation: 15,
    shadowColor: "#171717",
  },
  result: {
    fontSize: 18,
  },
  copyView: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },

  copyContainer: {
    width: "25%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    marginVertical: 7,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: "rgba(57, 57, 1, 1)",
  },
  copyText: {
    fontSize: 15,
    letterSpacing: 0.5,
    color: "white",
    fontWeight: "500",
  },
});
