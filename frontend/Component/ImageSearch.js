import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ImageSearch() {
  const [image, setImage] = useState(null);
  const [searchResult, setSearchResult] = useState("Search with image");

  function deleteImage() {
    setImage("");
    setSearchResult("Search with image");
  }

  function capitalizeMessage(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  async function searchHandler() {
    if (!image) {
      console.log("No image selected.");
      return;
    }

    const formData = new FormData();
    formData.append("image", {
      uri: image,
      name: "image.jpg",
      type: "image/jpg",
    });

    try {
      const response = await fetch(
        "https://70a6-2402-e280-3e4b-4e2-c039-a1ec-ab60-d01b.ngrok-free.app/image-upload",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const search_result = capitalizeMessage(data.message);
        console.log("Image search result:", search_result);
        setSearchResult(search_result);
      } else {
        console.error("Image search failed.");
      }
    } catch (error) {
      console.error("Error while sending image:", error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.resultView}>
        <Text style={styles.headingText}>{searchResult}</Text>
      </View>
      <View style={styles.modalView}>
        <View style={styles.ImageView}>
          {!image && (
            <TouchableOpacity style={styles.touchable} onPress={pickImage}>
              <Text style={styles.tapText}>Tap to upload image</Text>
            </TouchableOpacity>
          )}

          {image && <Image source={{ uri: image }} style={styles.imageStyle} />}
        </View>
        {image && (
          <TouchableOpacity
            style={styles.deleteImageIcon}
            onPress={deleteImage}
          >
            <Icon name="times" size={12} color="black" />
          </TouchableOpacity>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.searchButton} onPress={searchHandler}>
            <Text style={styles.searchText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  resultView: {
    marginTop: 80,
    paddingHorizontal: 10,
    paddingVertical: 20,
    width: "90%",
    alignItems: "center",
    backgroundColor: "#FBFAF5",
    borderRadius: 5,
    elevation: 5,
    borderColor: "grey",
  },
  modalView: {
    marginTop: 50,
    width: "90%",
    alignItems: "center",
    backgroundColor: "#FBFAF5",
    borderRadius: 5,
    elevation: 5,
    borderColor: "grey",
  },
  headingText: {
    fontSize: 20,
  },
  ImageView: {
    height: 200,
    width: "80%",
    alignItems: "center",
    marginTop: 30,
    justifyContent: "center",
    backgroundColor: "#E5E4E6",
    borderStyle: "dashed",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
  },
  imageStyle: {
    height: 197,
    width: 280,
    borderRadius: 3,
  },
  deleteImageIcon: {
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 3,
    paddingVertical: 1,
    position: "absolute",
    top: 22,
    right: 25,
  },
  touchable: {
    padding: 30,
  },
  searchButton: {
    margin: 30,
    width: "30%",
    padding: 13,
    alignItems: "center",
    backgroundColor: "rgba(57, 57, 1, 1)",
    borderRadius: 3,
    elevation: 5,
    shadowColor: "#171717",
  },
  searchText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
