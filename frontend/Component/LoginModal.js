import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function LoginModal({
  modalVisible,
  closeModal,
  registerHandler,
  usernameHandler,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [logggedInUsername, setLoggedInUsername] = useState("");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [emailBorderColor, setEmailBorderColor] = useState(
    "rgba(255, 255, 224, 1)"
  );
  const [passwordBorderColor, setPasswordBorderColor] = useState(
    "rgba(255, 255, 224, 1)"
  );

  function handleLogout() {
    setLoggedInUsername("");
    usernameHandler("");

    closeModal();
  }

  useEffect(() => {
    // This useEffect will run when the modalVisible prop changes
    if (!modalVisible) {
      // Reset the input fields and border colors when modal is closed
      setLoginError("");

      setEmail("");
      setPassword("");
      setEmailBorderColor("rgba(255, 255, 224, 1)");
      setPasswordBorderColor("rgba(255, 255, 224, 1)");
    }
  }, [modalVisible]); // Dependency array ensures this effect runs when modalVisible changes

  function handleLogin() {
    if (!email) {
      setEmailBorderColor("red");
    } else {
      setEmailBorderColor("rgba(255, 255, 224, 1)");
    }
    if (!password) {
      setPasswordBorderColor("red");
    } else {
      setPasswordBorderColor("rgba(255, 255, 224, 1)");
    }

    emailRef.current.blur();
    passwordRef.current.blur();

    if (email && password) {
      const loginData = {
        email: email,
        password: password,
      };

      fetch(
        "https://20d7-2402-e280-3e4b-4e2-55f0-4b8f-8147-45b6.ngrok-free.app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.errors) {
            data.errors.forEach((error) => {
              console.error("Error:", error);
            });
          }
          if (data.error) {
            //console.error("Error:", data.error);
            setLoginError(data.error);
          } else {
            console.log(data);
            setEmail("");
            setPassword("");
            setLoggedInUsername(data.username);
            usernameHandler(data.username); //passing username to DictionaryStack in app.js

            closeModal();
          }
        })
        .catch((error) => {
          console.error("Login Error:", error);
        });
    }
  }

  return (
    <Modal transparent={true} visible={modalVisible} animationType="fade">
      <View style={styles.modalContainer}>
        {logggedInUsername.length == "" && (
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.IconContainer} onPress={closeModal}>
              <Icon name="times" size={18} color="rgba(255, 255, 224, 1)" />
            </TouchableOpacity>
            <Text style={styles.loginText}>Login</Text>
            <Text style={styles.loginErrorText}>{loginError}</Text>

            <TextInput
              ref={emailRef}
              style={[styles.inputField, { borderColor: emailBorderColor }]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailBorderColor("rgba(255, 255, 224, 1)")}
              autoCapitalize="none"
              inputMode="email"
            />
            <TextInput
              ref={passwordRef}
              style={[styles.inputField, { borderColor: passwordBorderColor }]}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordBorderColor("rgba(255, 255, 224, 1)")}
              inputMode="numeric"
            />
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPassword}>Fogot your password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={registerHandler}
            >
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
        )}
        {logggedInUsername.length != "" && (
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.IconContainer} onPress={closeModal}>
              <Icon name="times" size={18} color="rgba(255, 255, 224, 1)" />
            </TouchableOpacity>
            <View style={styles.smileIcon}>
              <Icon name="smile-o" size={30} color="rgba(255, 255, 224, 1)" />
            </View>
            <Text style={styles.username}>Hello! {logggedInUsername}</Text>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogout}>
              <Text style={styles.loginButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000055",
  },

  modalView: {
    marginTop: 90,
    width: "90%",
    backgroundColor: "rgba(57, 57, 1, 1)",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 224, 1)",
    paddingVertical: 45,
    paddingHorizontal: 30,
    alignItems: "center",
    shadowColor: "#000",
    elevation: 10,
  },

  IconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    borderWidth: 2,
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderColor: "rgba(255, 255, 224, 1)",
    borderRadius: 30,
  },

  loginText: {
    marginBottom: 5,
    fontSize: 25,
    color: "rgba(255, 255, 224, 1)",
  },

  loginErrorText: {
    color: "red",
    fontSize: 18,
  },

  inputField: {
    width: "100%",
    marginTop: 5,
    marginBottom: 12,
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 30,
    fontSize: 18,

    backgroundColor: "rgba(255, 255, 224, 1)",
    borderWidth: 2,
    elevation: 5,
    borderColor: "white",
  },

  forgotPasswordContainer: {
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 224, 1)",
    marginTop: 10,
  },

  forgotPassword: {
    color: "rgba(255, 255, 224, 1)",
  },

  loginButton: {
    marginTop: 30,
    width: "50%",
    padding: 13,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 224, 1)",
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#171717",
  },

  loginButtonText: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  registerButton: {
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 224, 1)",
  },
  registerText: {
    color: "rgba(255, 255, 224, 1)",
    marginTop: 20,
  },

  username: {
    color: "rgba(255, 255, 224, 1)",
    fontSize: 22,
  },

  smileIcon: {
    marginBottom: 25,
  },
});
