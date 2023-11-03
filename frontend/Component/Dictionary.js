import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";

import ImageSearch from "./ImageSearch";

export default function Dictionary({ route, navigation, username }) {
  const [input, setInput] = useState("");
  const [word, setWord] = useState("");
  const [englishMeaning, setEnglishMeaning] = useState("");
  const [hindiMeaning, setHindiMeaning] = useState("");
  const [sanskritMeaning, setSanskritMeaning] = useState("");
  const [chineseMeaning, setChineseMeaning] = useState("");
  const [marathiMeaning, setMarathiMeaning] = useState("");
  const [tibetanMeaning, setTibetanMeaning] = useState("");
  const [pos, setPos] = useState("");
  const [selectedLanguage, setSelecteLanguage] = useState("en");
  const [suggestions, setSuggestions] = useState([]);
  const [recent, setRecent] = useState([]);
  const [languageDropdownView, setLanguageDropdownView] = useState(false);
  const [languageDropdown, setLanguageDropdown] = useState("English");
  const [isDropdownOpen, setIsDropdownopen] = useState(false);

  function closeDropdown() {
    setLanguageDropdownView(false);
  }

  function clearInput() {
    setInput("");
    setSuggestions("");
  }

  function inputHandler(event) {
    const searchWord = event.trim();
    setInput(searchWord);
    console.log(searchWord);

    // Fetch suggestions based on input
    fetch(
      `https://7871-2402-e280-3e4b-4e2-2164-be1f-d5c7-8697.ngrok-free.app/api/suggestions/${selectedLanguage}/${searchWord}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        //console.log(data);
        setSuggestions(data); // Set the suggestions state
      })
      .catch(function (error) {
        console.log("Error fetching suggestions: " + error.message);
      });
  }

  //search from database
  function searchHandler() {
    if (input) {
      setWord("");
      fetch(
        `https://7871-2402-e280-3e4b-4e2-2164-be1f-d5c7-8697.ngrok-free.app/api/${selectedLanguage}/${input}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((resp) => resp.json())
        .then((data) => {
          if (data.error) {
            setWord("Word not found");
            setMeaning("");
            setPos("");
          } else {
            setWord(data.word);
            setEnglishMeaning(data.english_meaning);
            setHindiMeaning(data.hindi_meaning);
            setSanskritMeaning(data.sanskrit_meaning);
            setChineseMeaning(data.chinese_meaning);
            setMarathiMeaning(data.marathi_meaning);
            setTibetanMeaning(data.tibetan_meaning);
            setPos(data.pos);
            console.log("Search words:- ", data); // Handle the response data from the backend if needed
          }
        })
        .catch(function (error) {
          console.Error(
            "There has been a problem with your search operation: " +
              error.message
          );
        });
      setInput("");

      //http post request to history endpoint for setting search history
      if (!username) {
        console.log("Log is not done");
      }
      if (username) {
        const user_history = {
          username: username,
          word: input,
          language: selectedLanguage,
        };

        fetch(
          "https://7871-2402-e280-3e4b-4e2-2164-be1f-d5c7-8697.ngrok-free.app/history",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user_history),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data.message);
          })
          .catch((error) => {
            console.error("Seach history Error:", error);
          });
      }
    }
  }

  //useEffect for display recents whenever user login or new words being searched
  useEffect(() => {
    if (username) {
      fetch(
        "https://7871-2402-e280-3e4b-4e2-2164-be1f-d5c7-8697.ngrok-free.app/recent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("User history: ", data);
          setRecent(data);
        })
        .catch((error) => {
          console.error("Error fetching recent history:", error);
        });
    }
  }, [username, word]);

  useEffect(() => {
    if (selectedLanguage == "en") {
      setLanguageDropdown("English");
    }
    if (selectedLanguage == "hi") {
      setLanguageDropdown("Hindi");
    }
    if (selectedLanguage == "sa") {
      setLanguageDropdown("Sansk..");
    }
    if (selectedLanguage == "zh") {
      setLanguageDropdown("Chinese");
    }
    if (selectedLanguage == "mr") {
      setLanguageDropdown("Marathi");
    }
    if (selectedLanguage == "ti") {
      setLanguageDropdown("Tibetan");
    }
    setWord("");
    setPos("");
    setEnglishMeaning("");
    setHindiMeaning("");
    setSanskritMeaning("");
    setChineseMeaning("");
    setMarathiMeaning("");
    setTibetanMeaning("");
  }, [selectedLanguage]);

  function languageMeaningHandler(language) {
    setLanguageDropdown(language);
    setLanguageDropdownView(false);
  }

  function capitalizeWord(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.pickerView}>
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
          <Picker.Item label="Chinese" value="zh" />
          <Picker.Item label="Marathi" value="mr" />
          <Picker.Item label="Tibetan" value="ti" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputStyle}
          onChangeText={inputHandler}
          defaultValue={input}
          placeholder="Type word"
          onClearText={clearInput}
        />
      </View>
      {/* Suggestions */}
      {/* Suggestions */}
      {input.length > 0 && (
        <View style={styles.suggestionDropdown}>
          {suggestions.slice(0, 10).map((suggestion) => (
            <TouchableOpacity
              key={suggestion.id}
              style={styles.suggestionItem}
              onPress={() => {
                setInput(suggestion.word);
                setSuggestions([]); // Clear suggestions
              }}
            >
              <Text style={styles.suggestionText}>{suggestion.word}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchButton} onPress={searchHandler}>
          <Text style={styles.textButton}>Search</Text>
        </TouchableOpacity>
        <ImageSearch />
      </View>

      <View style={[styles.meaningContainer, styles.elevation]}>
        <View style={styles.wordContainer}>
          <Text style={styles.wordText}>{word}</Text>
        </View>
        {pos != "" && <Text style={styles.posTagging}>({pos})</Text>}

        <Text style={styles.wordResult}>
          {languageDropdown === "English" && englishMeaning}
          {languageDropdown === "Hindi" && hindiMeaning}
          {languageDropdown === "Sansk.." && sanskritMeaning}
          {languageDropdown === "Chinese" && chineseMeaning}
          {languageDropdown === "Marathi" && marathiMeaning}
          {languageDropdown === "Tibetan" && tibetanMeaning}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.meaningLanguageContainer}
        onPress={() => setLanguageDropdownView(!languageDropdownView)}
      >
        <View style={styles.meaningLanguageView}>
          <Text style={styles.meaningLanguageText}>{languageDropdown}</Text>
          <Icon name="caret-down" color="rgba(57, 57, 1, 1)" size={20} />
        </View>
      </TouchableOpacity>

      {languageDropdownView && (
        <View style={styles.dropdownView}>
          <TouchableOpacity
            style={styles.dropdownLanguageField}
            onPress={() => languageMeaningHandler("English")}
          >
            <Text style={styles.dropdownLanguageText}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownLanguageField}
            onPress={() => languageMeaningHandler("Hindi")}
          >
            <Text style={styles.dropdownLanguageText}>Hindi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownLanguageField}
            onPress={() => languageMeaningHandler("Sansk..")}
          >
            <Text style={styles.dropdownLanguageText}>Sanskrit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownLanguageField}
            onPress={() => languageMeaningHandler("Chinese")}
          >
            <Text style={styles.dropdownLanguageText}>Chinease</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownLanguageField}
            onPress={() => languageMeaningHandler("Marathi")}
          >
            <Text style={styles.dropdownLanguageText}>Marathi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownLanguageField}
            onPress={() => languageMeaningHandler("Tibetan")}
          >
            <Text style={styles.dropdownLanguageText}>Tibetan</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.recentContainer}>
        <Text style={styles.recentText}>Recents</Text>
        {username && (
          <FlatList
            data={recent.reverse().slice(0, 30)}
            renderItem={({ item }) => {
              return (
                <Text style={styles.recentwords}>{item.searched_word}</Text>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "rgba(224, 224, 121, 1)",
  },

  picker: {
    width: "39.7%",
  },

  inputContainer: {
    paddingTop: 0,
  },

  inputStyle: {
    borderColor: "rgba(57, 57, 1, 1)",
    borderBottomWidth: 2,
    marginTop: 5,
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: 5,
    fontSize: 20,
    backgroundColor: "rgba(255, 255, 224, 1)",
  },

  suggestionDropdown: {
    position: "absolute",
    top: 135, // Adjust this to position the dropdown
    left: 20, // Adjust this to align the dropdown with the input
    //right: 30, // Adjust this to align the dropdown with the input
    backgroundColor: "#ffffffee",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    //maxHeight: 150,
    zIndex: 1000,
    elevation: 5,
  },

  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },

  suggestionText: {
    fontSize: 18,
  },

  searchButton: {
    marginTop: 10,
    width: "30%",
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  meaningContainer: {
    marginTop: 50,
    height: 220,
    backgroundColor: "rgba(255, 255, 224, 1)",
    borderRadius: 5,
  },
  elevation: {
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
  },
  wordText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  meaningLanguageContainer: {
    position: "absolute",
    top: 249,
    right: 24.5,
    backgroundColor: "rgba(249, 249, 212, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 5,
    zIndex: 1000,
  },
  meaningLanguageView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  meaningLanguageText: {
    paddingRight: 5,
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(57, 57, 1, 1)",
  },
  dropdownView: {
    position: "absolute",
    top: 180,
    right: 20,
    backgroundColor: "#ffffff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    zIndex: 1000,
    elevation: 5,
  },
  dropdownLanguageField: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  dropdownLanguageText: {
    fontSize: 16,
    fontWeight: "400",
  },

  posTagging: {
    paddingTop: 8,
    paddingHorizontal: 15,
    fontSize: 18,
  },
  wordResult: {
    paddingTop: 15,
    paddingHorizontal: 12,
    fontSize: 18,
    fontWeight: "400",
  },
  recentContainer: {
    height: 240,
    marginTop: 16,
    backgroundColor: "rgba(255, 255, 224, 1)",
    borderRadius: 5,
    elevation: 5,
    shadowColor: "#52006A",
  },
  recentText: {
    paddingLeft: 15,
    paddingVertical: 11,
    width: "100%",
    borderRadius: 5,
    borderColor: "rgba(120, 120, 120, 0.97)",
    borderBottomWidth: 2,
    color: "rgba(120, 120, 120, 0.97)",
    backgroundColor: "rgba(153, 153, 153, 0.68)",
    //backgroundColor: "rgba(164, 164, 164, 0.39)",
    fontSize: 20,
    fontWeight: "500",
    elevation: 5,
    shadowColor: "rgba(242, 251, 36, 0.68)",
  },

  recentwords: {
    paddingHorizontal: 15,
    paddingVertical: 11.6,
    fontSize: 17,
    fontWeight: "500",
    borderTopWidth: 1,
    borderColor: "rgba(184, 185, 181, 0.34)",
    color: "#858486",
  },
});
