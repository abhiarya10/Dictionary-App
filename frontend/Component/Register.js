import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registrationMessage, setRegisterMessage] = useState("");
  const [usernameBorder, setUserNameBorder] = useState("black");
  const [emailBorder, setEmialBorder] = useState("black");
  const [passwordBorder, setPasswordBorder] = useState("black");
  const [confirmPasswordBorder, setConfirmPasswordBorder] = useState("black");
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  function usernameHandler(event) {
    const trimedUsername = event.trim();
    setUsername(trimedUsername);
  }
  function emailHandler(event) {
    const trimedEmail = event.trim();
    setEmail(trimedEmail);
  }
  function passwordHandler(event) {
    const trimedPassword = event.trim();
    setPassword(trimedPassword);
  }
  function confirmPasswordHandler(event) {
    const trimedConfirmPassword = event.trim();
    setConfirmPassword(trimedConfirmPassword);
  }

  function registerHandler() {
    //create an object with user registration data
    const userData = {
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };

    if (!username) {
      setUserNameBorder("red");
    }
    if (!email) {
      setEmialBorder("red");
    }
    if (!password) {
      setPasswordBorder("red");
    }
    if (!confirmPassword) {
      setConfirmPasswordBorder("red");
    }

    if (password != confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setPasswordBorder("red");
      setConfirmPasswordBorder("red");
    }

    usernameRef.current.blur();
    emailRef.current.blur();
    passwordRef.current.blur();
    confirmPasswordRef.current.blur();

    if (
      username &&
      email &&
      password &&
      confirmPassword &&
      password == confirmPassword
    ) {
      fetch(
        "https://3d8e-2402-e280-3e4b-4e2-ad88-4729-82fb-15fd.ngrok-free.app/registration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            //console.error("Error: ", data.error);
            setRegisterMessage(data.error);
          } else {
            console.log(data.message);
            setRegisterMessage(data.message);
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{registrationMessage}</Text>
      <View style={styles.form}>
        <TextInput
          ref={usernameRef}
          style={[styles.input, { borderColor: usernameBorder }]}
          defaultValue={username}
          placeholder="Username"
          onChangeText={usernameHandler}
          onFocus={() => setUserNameBorder("black")}
        />
        <TextInput
          ref={emailRef}
          style={[styles.input, { borderColor: emailBorder }]}
          defaultValue={email}
          placeholder="Email"
          onChangeText={emailHandler}
          onFocus={() => setEmialBorder("black")}
          autoCapitalize="none"
          inputMode="email"
        />
        <TextInput
          ref={passwordRef}
          style={[styles.input, { borderColor: passwordBorder }]}
          defaultValue={password}
          placeholder="Password"
          onChangeText={passwordHandler}
          onFocus={() => setPasswordBorder("black")}
          inputMode="numeric"
          secureTextEntry={true}
        />
        <TextInput
          ref={confirmPasswordRef}
          style={[styles.input, { borderColor: confirmPasswordBorder }]}
          defaultValue={confirmPassword}
          placeholder="Confirm password"
          onChangeText={confirmPasswordHandler}
          onFocus={() => setConfirmPasswordBorder("black")}
          inputMode="numeric"
          secureTextEntry={true}
        />

        <TouchableOpacity
          style={styles.registerButton}
          onPress={registerHandler}
        >
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 224, 1)",
    padding: 30,
  },
  message: {
    color: "red",
    textAlign: "center",
    fontSize: 18,
  },

  form: {
    paddingHorizontal: 10,
    paddingTop: 5,
  },

  input: {
    paddingTop: 20,
    paddingBottom: 5,
    paddingHorizontal: 5,
    marginVertical: 10,
    fontSize: 18,
    fontWeight: "400",
    letterSpacing: 0.5,
    borderBottomWidth: 1,
  },

  registerButton: {
    marginTop: 25,
    width: "32%",
    padding: 13,
    alignItems: "center",
    backgroundColor: "rgba(57, 57, 1, 1)",
    borderRadius: 3,
    elevation: 5,
    shadowColor: "#171717",
  },

  registerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
