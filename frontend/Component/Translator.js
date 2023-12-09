import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Translator() {
  const [modal, setModal] = useState(false);
  const [selectedLanguage, setSelecteLanguage] = useState("en");
  const [input, setInput] = useState("");
  const [translatedResult, setTranslatedResult] = useState("");

  function modalHandler() {
    setModal(!modal);
  }

  function inputHandler(e) {
    setInput(e.trim());
  }

  function translateHandler() {
    if (input) {
      const translateData = {
        target_language: selectedLanguage,
        sentence: input,
      };

      fetch(
        "https://761b-2402-e280-3e4b-4e2-8119-93bc-308f-642c.ngrok-free.app/translate",
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
        })
        .catch((error) => {
          console.error("Seach history Error:", error);
        });
    }
  }

  return (
    <View>
      <Modal visible={modal} transparent={false}>
        <View style={styles.modalContainer}>
          <Text style={styles.headerText}>Translator</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={inputHandler}
              defaultValue={input}
              placeholder="Type sentence"
              //   onClearText={clearInput}
            />
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
            <Text style={styles.result}>{translatedResult}</Text>
          </View>
          <View style={styles.closeModalIcon}>
            <TouchableOpacity onPress={modalHandler}>
              <Icon name="times" size={50} color="#2B2B2B" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.translatorBtn} onPress={modalHandler}>
        <Text style={styles.translatorText}>Translator</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },

  headerText: {
    marginTop: 20,
    fontSize: 30,
    letterSpacing: 1,
    fontWeight: "700",
  },

  inputStyle: {
    width: 330,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderColor: "rgba(57, 57, 1, 1)",
    borderBottomWidth: 2,
    marginTop: 25,
    borderRadius: 5,
    fontSize: 20,
    backgroundColor: "rgba(255, 255, 224, 1)",
  },
  picker: {
    width: 138,
    height: 50,
  },
  pickerView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 25,
    width: 300,
  },

  pickerDestinationText: {
    fontSize: 17,
    fontWeight: "400",
  },
  searchContainer: {
    width: 330,
  },

  searchButton: {
    marginTop: 25,
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
    width: 330,
    borderRadius: 5,
    backgroundColor: "#D3D8D4",
    marginTop: 45,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  result: {
    fontSize: 18,
  },
  closeModalIcon: {
    width: 80,
    marginTop: 210,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FBFAF5",
    elevation: 5,
    borderColor: "grey",
    borderRadius: 50,
  },

  translatorBtn: {
    width: "30%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  translatorText: {
    fontSize: 17,
    fontWeight: "700",
    borderBottomWidth: 1,
    borderColor: "black",
  },
});