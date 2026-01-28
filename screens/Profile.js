import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, TextInput } from "react-native-paper";

import { ThemedText } from "@/components/themed-text";

export default function Profile({ logout }) {
  console.log("Profile received logout prop?", !!logout);

  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailNewsletter, setEmailNewsletter] = useState(false);
  const [discountOffers, setDiscountOffers] = useState(false);
  const [initials, setInitials] = useState("");

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const storedfirstName = await AsyncStorage.getItem("userFirstName");
      const storedEmail = await AsyncStorage.getItem("userEmail");
      const storedPhoneNumber = await AsyncStorage.getItem("userPhoneNumber");
      const storedProfileImage = await AsyncStorage.getItem("profileImage");
      const storedEmailNewsletter =
        await AsyncStorage.getItem("emailNewsletter");
      const storedDiscountOffers = await AsyncStorage.getItem("discountOffers");

      if (storedfirstName) setFirstName(storedfirstName);
      if (storedEmail) setEmail(storedEmail);
      if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber);
      if (storedProfileImage) setProfileImage(storedProfileImage);
      if (storedEmailNewsletter)
        setEmailNewsletter(storedEmailNewsletter === "true");
      if (storedDiscountOffers)
        setDiscountOffers(storedDiscountOffers === "true");
    } catch (error) {
      console.error("Failed to load profile data:", error);
    }
  };

  const saveProfile = async () => {
    if (!validateForm()) return;

    try {
      await AsyncStorage.setItem("userFirstName", firstName);
      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("userPhoneNumber", phoneNumber);
      await AsyncStorage.setItem("emailNewsletter", emailNewsletter.toString());
      await AsyncStorage.setItem("discountOffers", discountOffers.toString());

      if (profileImage) {
        await AsyncStorage.setItem("profileImage", profileImage);
      } else {
        await AsyncStorage.removeItem("profileImage");
      }

      Alert.alert("Success", "Profile saved successfully!");
    } catch (error) {
      console.error("Failed to save profile data:", error);
      Alert.alert("Error", "Failed to save data.");
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your gallery.");
      return;
    }

    // FIX: Use standard options for modern Expo SDK
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // <--- FIX: String array, not Enum
      allowsEditing: true,
      aspect: [1, 1], // Square for profile pics
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need camera access.");
      return;
    }

    // FIX: Use standard options
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"], // <--- FIX: String array
      // cameraType: 'front' // Removed deprecated Enum, let OS decide or use simple string if needed
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    if (firstName) {
      setInitials(firstName.charAt(0).toUpperCase());
    }
  };

  const showImageOptions = () => {
    Alert.alert("Profile Photo", "Choose an option", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Library", onPress: pickImage },
      { text: "Remove Photo", onPress: removeImage, style: "destructive" },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const validateForm = () => {
    // Simple validation is fine
    const nameRegex = /^[A-Za-z\s'-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(firstName)) {
      Alert.alert("Invalid Name", "Letters only, please.");
      return false;
    }
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Check your email format.");
      return false;
    }
    return true;
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      console.log("Cleared AsyncStorage on logout.");
      if (logout) {
        logout();
        console.log("Logged out successfully.");
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Profile</ThemedText>
      </View>

      {/* Profile Image Section */}
      <View style={styles.profileImageSection}>
        <View style={styles.imageContainer}>
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <ThemedText style={{ fontSize: 40, color: "#495E57" }}>
                {initials || "?"}
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.imageButtons}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={showImageOptions}
          >
            <Ionicons name="camera" size={20} color="#FFFFFF" />
            <ThemedText style={styles.imageButtonText}>Change</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Details Form */}
      <View style={styles.formSection}>
        <ThemedText style={styles.sectionTitle}>
          Personal Information
        </ThemedText>

        <TextInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          mode="outlined"
          style={styles.input}
          activeOutlineColor="#495E57"
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          activeOutlineColor="#495E57"
          keyboardType="email-address"
        />
        <TextInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          mode="outlined"
          style={styles.input}
          activeOutlineColor="#495E57"
          keyboardType="phone-pad"
        />
      </View>

      {/* Subscription Options (Using Switch now) */}
      <View style={styles.subscriptionSection}>
        <ThemedText style={styles.sectionTitle}>Email Notifications</ThemedText>

        <View style={styles.row}>
          <ThemedText style={styles.rowText}>Newsletter</ThemedText>
          <Switch
            value={emailNewsletter}
            onValueChange={setEmailNewsletter}
            trackColor={{ false: "#767577", true: "#495E57" }}
            thumbColor={emailNewsletter ? "#f4f3f4" : "#f4f3f4"}
          />
        </View>

        <View style={styles.row}>
          <ThemedText style={styles.rowText}>Special Offers</ThemedText>
          <Switch
            value={discountOffers}
            onValueChange={setDiscountOffers}
            trackColor={{ false: "#767577", true: "#495E57" }}
            thumbColor={discountOffers ? "#f4f3f4" : "#f4f3f4"}
          />
        </View>
      </View>

      <View style={styles.saveSection}>
        <Button
          mode="contained"
          onPress={saveProfile}
          buttonColor="#F4CE14"
          textColor="#000000"
        >
          Save Changes
        </Button>
        <Button
          mode="outlined"
          onPress={() => handleLogout()}
          style={{ marginTop: 10, borderColor: "#F4CE14" }}
          textColor="#000000"
        >
          Log Out
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#495E57",
    alignItems: "center",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#FFFFFF" },
  profileImageSection: { alignItems: "center", paddingVertical: 20 },
  imageContainer: { marginBottom: 15 },
  profileImage: { width: 120, height: 120, borderRadius: 60 },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  imageButtons: { flexDirection: "row", gap: 10 },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#495E57",
    borderRadius: 8,
    gap: 5,
  },
  imageButtonText: { color: "#FFF", fontWeight: "bold" },
  formSection: { padding: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#495E57",
  },
  input: { marginBottom: 15, backgroundColor: "#FFF" },
  subscriptionSection: { padding: 20, backgroundColor: "#F9F9F9" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  rowText: { fontSize: 16, color: "#333333" },
  saveSection: { padding: 20, paddingBottom: 50 },
});
