import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { db } from "../../firebaseConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { AuthContext } from "../context/AuthProvider";

const EventForm = ({ route, navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useContext(AuthContext);

  const { event } = route.params || {};

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
    }
  }, [event]);

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    try {
      if (event) {
        const eventRef = doc(db, "events", event.id);
        await updateDoc(eventRef, { title, description });
        Alert.alert("Success", "Event updated successfully!");
      } else {
        await addDoc(collection(db, "events"), {
          title,
          description,
          createdBy: user.uid,
          createdAt: new Date(),
        });
        Alert.alert("Success", "Event created successfully!");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Could not save event: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {event ? "Edit Event" : "Create New Event"}
      </Text>
      <TextInput
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Event Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>
          {event ? "Update Event" : "Create Event"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default EventForm;