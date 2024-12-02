import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EventCard = ({
  event,
  onToggleFavorite,
  isFavorite,
  onDelete,
  onEdit,
  currentUserId,
}) => {
  const isCreatedByUser = event.createdBy === currentUserId && !!onDelete;

  return (
    <View style={styles.card}>
      {/* Event Image */}
      <Image
        source={{ uri: event.image || "https://picsum.photos/200/300" }}
        style={styles.image}
      />
      <View style={styles.content}>
        {/* Event Title and Description */}
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <View style={styles.actions}>
          {/* Favorite Icon */}
          <TouchableOpacity onPress={() => onToggleFavorite(event)}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color="red"
              style={styles.icon}
            />
          </TouchableOpacity>
          {/* Edit Icon */}
          {isCreatedByUser && (
            <TouchableOpacity onPress={() => onEdit(event)}>
              <Ionicons
                name="pencil-outline"
                size={24}
                color="#007BFF"
                style={styles.icon}
              />
            </TouchableOpacity>
          )}
          {/* Trash Icon */}
          {isCreatedByUser && (
            <TouchableOpacity onPress={() => onDelete(event.id)}>
              <Ionicons
                name="trash-outline"
                size={24}
                color="red"
                style={styles.icon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  icon: {
    marginHorizontal: 8,
  },
});

export default EventCard;