import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";

import ImageSearch from "./ImageSearch";
import Translator from "./Translator";

export default function Dictionary({ route, navigation, username }) {
  const [input, setInput] = useState("");
  const [meaning1, setMeaning1] = useState("");
  const [parallelForm, setParallelForm] = useState("");
  const [gender1, setGender1] = useState("");
  const [dictUsed, setDictUsed] = useState("");
  const [addtInfo, setAddtInfo] = useState("");
  const [citation, setCitation] = useState("");

  const [word, setWord] = useState("");

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
      `https://716f-2402-e280-3e4b-4e2-1451-d084-5cc-fe73.ngrok-free.app/api/suggestions/${selectedLanguage}/${searchWord}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
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
        `https://716f-2402-e280-3e4b-4e2-1451-d084-5cc-fe73.ngrok-free.app/api/${selectedLanguage}/${input}`,
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
          } else {
            setAddtInfo(additional_info);
            setCitation(citations);
            setDictUsed(dictionary_used);
            setMeaning1(meaning1);
            setGender1(gender1);
            setParallelForm(parallel_form);
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
          "https://716f-2402-e280-3e4b-4e2-1451-d084-5cc-fe73.ngrok-free.app/history",
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
        "https://716f-2402-e280-3e4b-4e2-1451-d084-5cc-fe73.ngrok-free.app/recent",
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
  }, [username, input]);

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
    <ScrollView>
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
            placeholder={
              selectedLanguage === "hi" ? "Type hindi word" : "Type word"
            }
            onClearText={clearInput}
          />
          {/* <TouchableOpacity style={styles.clearInputBtn} onPress={clearInput}>
          <Icon name="times" size={22} color="black" />
        </TouchableOpacity> */}
          <TouchableOpacity style={styles.searchButton} onPress={searchHandler}>
            <Text style={styles.textButton}>Search</Text>
          </TouchableOpacity>
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
                  if (selectedLanguage === "en") {
                    setInput(suggestion.english_word);
                  } else if (selectedLanguage === "hi") {
                    setInput(suggestion.hindi_word);
                  } else if (selectedLanguage === "zh") {
                    setInput(suggestion.chinese_word);
                  } else if (selectedLanguage === "sa") {
                    setInput(suggestion.sanskrit_word);
                  } else if (selectedLanguage === "mr") {
                    setInput(suggestion.marathi_word);
                  } else if (selectedLanguage === "ti") {
                    setInput(suggestion.tibetan_word);
                  }
                  setSuggestions([]); // Clear suggestions
                }}
              >
                <Text style={styles.suggestionText}>
                  {selectedLanguage === "en" && suggestion.english_word}
                  {selectedLanguage === "hi" && suggestion.hindi_word}
                  {selectedLanguage === "zh" && suggestion.chinese_word}
                  {selectedLanguage === "sa" && suggestion.sanskrit_word}
                  {selectedLanguage === "mr" && suggestion.marathi_word}
                  {selectedLanguage === "ti" && suggestion.tibetan_word}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* <View style={styles.searchContainer}>
        <View style={styles.imageTranslatorContainer}>
          <Translator />
          <ImageSearch />
        </View>
      </View> */}

        <View style={styles.posTaggingContainer}>
          <Text style={styles.posTaggingText}>Noun</Text>
        </View>
        <View style={styles.parallelFormsContainer}>
          <Text style={styles.parallelFormsText}>Parallel forms :</Text>
          <Text style={styles.parallelFormsResult}>{parallelForm}</Text>
        </View>
        <View style={styles.parallelFormsContainer}>
          <Text style={styles.parallelFormsText}>Meaning no :</Text>
          <Text style={styles.parallelFormsResult}>1</Text>
        </View>
        <View style={styles.parallelFormsContainer}>
          <Text style={styles.parallelFormsText}>Gender :</Text>
          <Text style={styles.parallelFormsResult}>{gender1}</Text>
        </View>

        <View style={styles.meaningBox}>
          <Text style={styles.meaningText}>Meaning</Text>
          <View style={styles.meaningResult}>
            <Text style={styles.meaningResultText}>{meaning1}</Text>
          </View>
        </View>
        <View style={styles.parallelFormsContainer}>
          <Text style={styles.parallelFormsText}>Dictionary used :</Text>
          <Text style={styles.parallelFormsResult}>{dictUsed}</Text>
        </View>
        <View style={styles.parallelFormsContainer}>
          <Text style={styles.parallelFormsText}>Addtional Info.</Text>
          <Text style={styles.parallelFormsResult}>{addtInfo}</Text>
        </View>
        <View style={styles.citationContainer}>
          <Text style={styles.citationText}>Citations : </Text>
          <Text style={styles.citations}>{citation}</Text>
        </View>

        {/* <View style={[styles.meaningContainer, styles.elevation]}>
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
      </View> */}
        {/* <TouchableOpacity
        style={styles.meaningLanguageContainer}
        onPress={() => setLanguageDropdownView(!languageDropdownView)}
      >
        <View style={styles.meaningLanguageView}>
          <Text style={styles.meaningLanguageText}>{languageDropdown}</Text>
          <Icon name="caret-down" color="rgba(57, 57, 1, 1)" size={20} />
        </View>
      </TouchableOpacity> */}

        {/* {languageDropdownView && (
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
      )} */}
        <View style={styles.wordsContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.wordsHeader}>In different languages</Text>
          </View>
          <View style={styles.allWordsContainer}>
            <Text style={styles.eachWord}>English</Text>
            <Text style={styles.eachWord}>Hindi</Text>
            <Text style={styles.eachWord}>Sanskrit</Text>
            <Text style={styles.eachWord}>Chinese</Text>
            <Text style={styles.eachWord}>Tibetan</Text>
            <Text style={styles.eachWord}>Marathi</Text>
          </View>
        </View>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 10,
    backgroundColor: "rgba(224, 224, 121, 1)",
  },

  picker: {
    width: "39.7%",
  },

  inputContainer: {
    paddingTop: 0,
    marginTop: 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",

    borderRadius: 5,
  },

  inputStyle: {
    width: 247,
    backgroundColor: "rgba(255, 255, 224, 1)",
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: 5,
    fontSize: 20,
    borderColor: "rgba(57, 57, 1, 1)",
    borderBottomWidth: 2,
  },
  clearInputBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 15,
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
    width: "30%",
    paddingVertical: 15,
    paddingHorizontal: 10,
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
  parallelFormsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  parallelFormsText: {
    fontSize: 18,
  },
  parallelFormsResult: {
    marginLeft: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 224, 1)",
    borderRadius: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageTranslatorContainer: {
    display: "flex",
    flexDirection: "column",

    alignItems: "center",
  },

  posTaggingContainer: {
    backgroundColor: "rgba(255, 255, 224, 1)",
    width: 70,
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 3,
  },
  posTaggingText: {
    fontSize: 15,
    fontWeight: "500",
  },

  meaningBox: {
    marginTop: 10,
    borderRadius: 5,
  },
  meaningText: {
    fontSize: 18,
  },
  meaningResult: {
    marginTop: 5,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 224, 1)",
    elevation: 5,
    shadowColor: "#52006A",
  },
  meaningResultText: {
    fontSize: 17,
  },

  citationContainer: {
    marginTop: 10,
  },
  citationText: {
    fontSize: 18,
  },
  citations: {
    fontSize: 17,
    marginTop: 5,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 224, 1)",
    borderRadius: 5,
    elevation: 5,
    shadowColor: "#52006A",
  },

  // baseWordMeaning: {
  //   backgroundColor: "white",
  //   padding: 5,
  //   textAlign: "center",
  //   fontSize: 17,
  // },

  // wordMeaningView: {
  //   padding: 10,
  // },

  // baseWordText: {
  //   margin: 4,
  //   fontSize: 16,
  // },
  // meaningContainer: {
  //   marginTop: 50,
  //   height: 220,
  //   backgroundColor: "rgba(255, 255, 224, 1)",
  //   borderRadius: 5,
  // },
  // elevation: {
  //   elevation: 5,
  //   shadowColor: "#52006A",
  // },

  // wordContainer: {
  //   backgroundColor: "rgba(57, 57, 1, 1)",
  //   width: "100%",
  //   alignItems: "center",
  //   paddingVertical: 12,
  //   borderRadius: 5,
  //   elevation: 5,
  //   shadowColor: "#52006A",
  // },
  // wordText: {
  //   color: "white",
  //   fontSize: 22,
  //   fontWeight: "bold",
  //   letterSpacing: 0.5,
  // },
  // meaningLanguageContainer: {
  //   position: "absolute",
  //   top: 249,
  //   right: 24.5,
  //   backgroundColor: "rgba(249, 249, 212, 0.8)",
  //   paddingHorizontal: 10,
  //   paddingVertical: 12,
  //   borderRadius: 5,
  //   zIndex: 1000,
  // },
  // meaningLanguageView: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // meaningLanguageText: {
  //   paddingRight: 5,
  //   fontSize: 15,
  //   fontWeight: "500",
  //   color: "rgba(57, 57, 1, 1)",
  // },
  // dropdownView: {
  //   position: "absolute",
  //   top: 180,
  //   right: 20,
  //   backgroundColor: "#ffffff",
  //   borderColor: "#ccc",
  //   borderWidth: 1,
  //   borderRadius: 5,
  //   zIndex: 1000,
  //   elevation: 5,
  // },
  // dropdownLanguageField: {
  //   paddingVertical: 10,
  //   paddingHorizontal: 15,
  //   borderTopWidth: 1,
  //   borderColor: "#ccc",
  // },
  // dropdownLanguageText: {
  //   fontSize: 16,
  //   fontWeight: "400",
  // },

  // posTagging: {
  //   paddingTop: 8,
  //   paddingHorizontal: 15,
  //   fontSize: 18,
  // },
  // wordResult: {
  //   paddingTop: 15,
  //   paddingHorizontal: 12,
  //   fontSize: 18,
  //   fontWeight: "400",
  // },
  wordsContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 224, 1)",
    borderRadius: 5,
    elevation: 5,
    shadowColor: "#52006A",
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
  },
  wordsHeader: {
    fontSize: 18,
    fontWeight: "500",
  },
  eachWord: {
    fontSize: 17,
    marginTop: 5,
  },
  recentContainer: {
    height: 190,
    marginTop: 10,
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
