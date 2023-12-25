import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  Text,
  Platform,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ImageSearch() {
  const [image, setImage] = useState(null);
  const [modal, setModal] = useState(false);
  const [searchResult, setSearchResult] = useState("Search with image");

  function deleteImage() {
    setImage("");
    setSearchResult("Search with image");
  }

  function modalHandler() {
    setModal(!modal);
  }

  function capitalizeMessage(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async function pickImage() {
    // No permissions request is necessary for launching the image library
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

    // Create a FormData object to send the image file
    const formData = new FormData();
    formData.append("image", {
      uri: image,
      name: "image.jpg", // You can adjust the filename as needed
      type: "image/jpg", // You can adjust the content type as needed
    });

    try {
      const response = await fetch(
        "https://716f-2402-e280-3e4b-4e2-1451-d084-5cc-fe73.ngrok-free.app/image-upload",
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
        // Handle the result as needed
      } else {
        console.error("Image search failed.");
      }
    } catch (error) {
      console.error("Error while sending image:", error);
    }
  }

  return (
    <View>
      <Modal visible={modal} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
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

              {image && (
                <Image source={{ uri: image }} style={styles.imageStyle} />
              )}
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
              <TouchableOpacity
                style={styles.searchButton}
                onPress={searchHandler}
              >
                <Text style={styles.searchText}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.closeModalIcon}>
            <TouchableOpacity onPress={modalHandler}>
              <Icon name="times" size={50} color="#2B2B2B" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.imageSearch} onPress={modalHandler}>
        <Text style={styles.imageSearchText}>Search with image</Text>
      </TouchableOpacity>
    </View>
    // <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    //   <Button title="Search with image" onPress={pickImage} />
    //   {image && (
    //     <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
    //   )}
    //   <Button title="Delete" onPress={deleteImage} />
    // </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#F8FBF8",
    alignItems: "center",
  },
  resultView: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginTop: 50,
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
  imageSearch: {
    marginLeft: 30,
    paddingTop: 10,
    borderBottomWidth: 1,
  },
  imageSearchText: {
    fontSize: 17,
    fontWeight: "800",
    //color: "rgba(57, 57, 1, 1)",
    letterSpacing: 0.5,
  },
  closeModalIcon: {
    marginTop: 110,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FBFAF5",
    elevation: 5,
    borderColor: "grey",
    borderRadius: 50,
  },
});
