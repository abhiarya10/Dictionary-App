import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/FontAwesome";

import Dictionary from "./Component/Dictionary";
import AdvanceSearch from "./Component/AdvanceSearch";
import About from "./Component/About";
import Contact from "./Component/Contact";
import LoginModal from "./Component/LoginModal"; // Import the LoginModal component
import Register from "./Component/Register";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

//for stack navigation
function DictionaryStack({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState("");

  function parentModalUsername(recieveUsername) {
    setUsername(recieveUsername);
  }

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const registerHandler = () => {
    setModalVisible(false);
    navigation.navigate("Register");
  };

  return (
    <React.Fragment>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "rgba(224, 224, 121, 1)",
          },
          headerTintColor: "rgba(57, 57, 1, 1)",
          headerTitleStyle: {
            fontSize: 30,
            fontWeight: "700",
          },
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name=" "
          //component={() => <Dictionary username={username} />}
          //initialParams={{ username: username }}
          options={{
            title: "My Dictionary",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Icon name="bars" size={35} color="rgba(57, 57, 1, 1)" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={toggleModal}>
                <Icon name="user-circle" size={35} color="rgba(57, 57, 1, 1)" />
              </TouchableOpacity>
            ),
          }}
        >
          {() => <Dictionary username={username} />}
        </Stack.Screen>
        <Stack.Screen name="Advanced Search" component={AdvanceSearch} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
      <LoginModal
        modalVisible={modalVisible}
        closeModal={toggleModal}
        registerHandler={registerHandler}
        usernameHandler={parentModalUsername}
      />
    </React.Fragment>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: "rgba(255, 255, 224, 1)" }}
    >
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false, // This will hide the Drawer Navigator header
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="My Dictionary" component={DictionaryStack} />
        <Drawer.Screen name="About us" component={About} />
        <Drawer.Screen name="Contact us" component={Contact} />
        <Drawer.Screen name="Advanced Search" component={AdvanceSearch} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
