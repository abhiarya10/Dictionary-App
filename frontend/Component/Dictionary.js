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
  const [word, setWord] = useState("");
  const [meaning1, setMeaning1] = useState("");
  const [meaning2, setMeaning2] = useState("");
  const [parallelForm, setParallelForm] = useState("");
  const [gender1, setGender1] = useState("");
  const [gender2, setGender2] = useState("");
  const [dictUsed, setDictUsed] = useState("");
  const [addtInfo, setAddtInfo] = useState("");
  const [citation, setCitation] = useState("");

  const [selectedLanguage, setSelecteLanguage] = useState("en");
  const [suggestions, setSuggestions] = useState([]);
  const [recent, setRecent] = useState([]);
  const [englishWord, setEnglishWord] = useState("");
  const [hindiWord, setHindiWord] = useState("");
  const [marathiWord, setMarathiWord] = useState("");
  const [chineseWord, setChineseWord] = useState("");
  const [tibetanWord, setTibetanWord] = useState("");
  const [sanskritWord, setSanskritWord] = useState("");
  const [paliWord, setPaliWord] = useState("");

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
      `https://20d7-2402-e280-3e4b-4e2-55f0-4b8f-8147-45b6.ngrok-free.app/api/suggestions/${selectedLanguage}/${searchWord}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log("suggestion", data);
        setSuggestions(data); // Set the suggestions state
      })
      .catch(function (error) {
        console.log("Error fetching suggestions: " + error.message);
      });
  }

  //search from database
  function searchHandler() {
    if (input) {
      setWord(input);
      setCitation("");
      setDictUsed("");
      setMeaning1("");
      setGender1("");
      setParallelForm("");
      setAddtInfo("");
      setEnglishWord("");
      setHindiWord("");
      setSanskritWord("");
      setPaliWord("");
      setMarathiWord("");
      setChineseWord("");
      setTibetanWord("");

      fetch(
        `https://20d7-2402-e280-3e4b-4e2-55f0-4b8f-8147-45b6.ngrok-free.app/api/${selectedLanguage}/${input}`,
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
            setWord("Word not found error");
          } else {
            setCitation(data.searched_word.citations);
            setDictUsed(data.searched_word.dictionary_used);
            setMeaning1(data.searched_word.meaning1);
            setMeaning2(data.searched_word.meaning2);
            setGender1(data.searched_word.gender1);
            setGender2(data.searched_word.gender2);
            setParallelForm(data.searched_word.parallel_form);
            setAddtInfo(data.searched_word.additional_info);

            // Loop through related_rows and set words based on language
            data.related_rows.forEach((row) => {
              switch (row.language) {
                case "en":
                  setEnglishWord(row.word);
                  break;
                case "hi":
                  setHindiWord(row.word);
                  break;
                case "zh":
                  setChineseWord(row.word);
                  break;
                case "ti":
                  setTibetanWord(row.word);
                  break;
                case "sa":
                  setSanskritWord(row.word);
                  break;
                case "mr":
                  setMarathiWord(row.word);
                  break;
                case "pi":
                  setPaliWord(row.word);
                  break;
                default:
                  // Handle unknown language or set a default behavior
                  break;
              }
            });

            console.log("Search words:- ", data); // Handle the response data from the backend if needed
          }
        })
        .catch(function (error) {
          console.error(
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
          "https://20d7-2402-e280-3e4b-4e2-55f0-4b8f-8147-45b6.ngrok-free.app/history",
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
        "https://20d7-2402-e280-3e4b-4e2-55f0-4b8f-8147-45b6.ngrok-free.app/recent",
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
            <Picker.Item label="Pali" value="pi" />
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

          <TouchableOpacity style={styles.searchButton} onPress={searchHandler}>
            <Text style={styles.textButton}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Suggestions */}
        <View>
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
        </View>

        <View style={styles.parallelFormsContainer}>
          <Text style={styles.parallelFormsText}>Word :</Text>
          <Text style={styles.wordResult}>{word}</Text>
        </View>
        <View style={styles.parallelFormsContainer}>
          <Text style={styles.parallelFormsText}>Parallel forms :</Text>
          <Text style={styles.wordResult}>{parallelForm}</Text>
        </View>
        <View style={styles.mainMeaningContainer}>
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
              <Text style={styles.meaningResultText} selectable={true}>
                {meaning1}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.mainMeaningContainer}>
          <View style={styles.parallelFormsContainer}>
            <Text style={styles.parallelFormsText}>Meaning no :</Text>
            <Text style={styles.parallelFormsResult}>2</Text>
          </View>
          <View style={styles.parallelFormsContainer}>
            <Text style={styles.parallelFormsText}>Gender :</Text>
            <Text style={styles.parallelFormsResult}>{gender2}</Text>
          </View>

          <View style={styles.meaningBox}>
            <Text style={styles.meaningText}>Meaning</Text>
            <View style={styles.meaningResult}>
              <Text style={styles.meaningResultText} selectable={true}>
                {meaning2}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.parallelFormsContainer}>
          <Text style={styles.parallelFormsText}>Dictionary used :</Text>
          <Text style={styles.wordResult}>{dictUsed}</Text>
        </View>

        <View style={styles.citationContainer}>
          <Text style={styles.citationText}>Additional Info.</Text>
          <Text style={styles.citations}>{addtInfo}</Text>
        </View>

        <View style={styles.citationContainer}>
          <Text style={styles.citationText}>Citations : </Text>
          <Text style={styles.citations} selectable={true}>
            {citation}
          </Text>
        </View>

        <View style={styles.wordsContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.wordsHeader}>In different languages</Text>
          </View>
          <View style={styles.allWordsContainer}>
            <View style={styles.allWords}>
              <Text style={styles.eachWord}>English :-</Text>
              <Text style={styles.eachWord}> {englishWord}</Text>
            </View>
            <View style={styles.allWords}>
              <Text style={styles.eachWord}>Hindi :-</Text>
              <Text style={styles.eachWord}> {hindiWord}</Text>
            </View>
            <View style={styles.allWords}>
              <Text style={styles.eachWord}>Sanskrit :-</Text>
              <Text style={styles.eachWord}> {sanskritWord}</Text>
            </View>
            <View style={styles.allWords}>
              <Text style={styles.eachWord}>Chinese :-</Text>
              <Text style={styles.eachWord}> {chineseWord}</Text>
            </View>
            <View style={styles.allWords}>
              <Text style={styles.eachWord}>Marathi :-</Text>
              <Text style={styles.eachWord}> {marathiWord}</Text>
            </View>
            <View style={styles.allWords}>
              <Text style={styles.eachWord}>Tibetan :-</Text>
              <Text style={styles.eachWord}> {tibetanWord}</Text>
            </View>
            <View style={styles.allWords}>
              <Text style={styles.eachWord}>Pali :-</Text>
              <Text style={styles.eachWord}> {paliWord}</Text>
            </View>
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
    width: "100%",
    borderRadius: 5,
  },

  inputStyle: {
    flex: 1,
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

    backgroundColor: "#ffffffee",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
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
    color: "black",
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
  wordResult: {
    marginLeft: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 224, 1)",
    borderRadius: 2,
    elevation: 5,
    shadowColor: "#171717",
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
    paddingVertical: 2,
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 224, 1)",
    borderRadius: 2,
    elevation: 5,
    shadowColor: "#171717",
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
  mainMeaningContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 5,
    backgroundColor: "rgba(255, 255, 204, 1)",
    borderRadius: 5,
    elevation: 5,
    shadowColor: "#171717",
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
    marginRight: 10,
  },
  allWordsContainer: {
    paddingBottom: 5,
  },
  allWords: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
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
