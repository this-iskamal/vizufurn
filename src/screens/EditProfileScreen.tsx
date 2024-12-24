import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import { useAuthStore } from "../state/authstore";  // Adjust the path according to your project structure
import { appAxios } from "../utils/apiinceptor";
import { BackendUrl } from "../utils/utils";
import { useNavigation } from "@react-navigation/native";

export function EditProfileScreen() {
  const { user, setUser } = useAuthStore();  // Destructure user from your global store
  const [name, setName] = useState(user?.name || "");  // Initialize state with data from the store
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [loading, setLoading] = useState(false);
  const navigation= useNavigation();

  // Handle Save Profile Changes
  const handleSave = async () => {
    setLoading(true);  // Set loading to true while the request is being processed

    try {
      // Prepare the data to be sent in the PATCH request
      const updateData = {
        name,
        phone,
        address,
      };

      // Send a PATCH request to update the user profile
      const response = await appAxios.patch(`${BackendUrl}api/user`, updateData);

      // Handle success
      if (response.status === 200) {
        // Update the global store with the new data
        setUser({
          ...user,
          name,
          phone,
          address,
        });
        Alert.alert("Success!", "Profile updated successfully", [{ text: "OK" }]);
      }
    } catch (error) {
      // Handle error (e.g., network issues, invalid data, etc.)
      console.log(error);
      Alert.alert("Error", "Something went wrong. Please try again.", [{ text: "OK" }]);
    } finally {
      setLoading(false);  // Set loading to false after request completion
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
          style={styles.avatar}
        />
        <Text style={styles.title}>Edit Profile</Text>
        <Text style={styles.subtitle}>Update your personal information</Text>
      </View>

      {/* Form Fields */}
      <View style={styles.form}>
        {/* Name Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
          />
        </View>

        {/* Phone Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>

        {/* Address Field */}
        <View style={styles.field}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
            multiline
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading} // Disable the button while loading
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    height: 96,
    width: 96,
    borderRadius: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  form: {
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    fontSize: 16,
    color: "#111827",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  actions: {
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: "tomato",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
});
