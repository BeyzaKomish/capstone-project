import { Image } from "expo-image";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

import { HelloWave } from "@/components/hello-wave";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Onboarding({ completeOnboarding }) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  const isNameValid = firstName.length > 0 && /^[a-zA-Z\s]+$/.test(firstName);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isButtonDisabled = !isNameValid || !isEmailValid;
  const logoImage = require("../assets/images/little-lemon-logo.png");

  const handleLogin = async () => {
    // Double check validation before saving
    if (isButtonDisabled) {
      Alert.alert(
        "Invalid Input",
        "Please check your name (letters only) and email.",
      );
      return;
    }

    try {
      // Use setItem to SAVE data (key, value)
      await AsyncStorage.setItem("userFirstName", firstName);
      await AsyncStorage.setItem("userEmail", email);

      // This is the flag your App.js looks for!
      await AsyncStorage.setItem("isOnboarded", "true");

      completeOnboarding();

      console.log("Onboarding Completed. Data saved.");
    } catch (e) {
      console.error("Failed to save onboarding status.", e);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={styles.restaurantName}>Little Lemon</Text>
      </View>

      {/* Welcome Section */}
      <ThemedView style={styles.welcomeContainer}>
        <ThemedText type="title" style={styles.welcomeTitle}>
          Welcome To Our Restaurant!
          <HelloWave />
        </ThemedText>
      </ThemedView>

      {/* Form Section */}
      <View style={styles.formContainer}>
        <ThemedText style={styles.formDescription}>
          Let us get to know you
        </ThemedText>

        <View style={styles.inputContainer}>
          <TextInput
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            mode="outlined"
            style={styles.input}
            activeOutlineColor="#495E57"
            outlineColor="#CCCCCC"
            contentStyle={styles.inputContent}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            activeOutlineColor="#495E57"
            outlineColor="#CCCCCC"
            contentStyle={styles.inputContent}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Button
          buttonColor="#F4CE14"
          textColor="#495E57"
          mode="contained"
          onPress={handleLogin}
          disabled={isButtonDisabled}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
        >
          Next
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDEFEE",
  },
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: "#495E57",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 25,
  },
  logo: {
    height: 70,
    width: 60,
  },
  restaurantName: {
    fontSize: 30,
    color: "#F4CE14",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  welcomeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 20,
    marginHorizontal: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "#495E57",
    borderRadius: 12,
    gap: 10,
  },
  welcomeTitle: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  formDescription: {
    fontSize: 18,
    color: "#495E57",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 40,
    gap: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
  },
  inputContent: {
    paddingHorizontal: 15,
  },
  submitButton: {
    borderRadius: 8,
    marginTop: 20,
  },
  submitButtonContent: {
    paddingVertical: 7,
  },
});
