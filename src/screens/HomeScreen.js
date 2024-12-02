import React, {useEffect, useState, useContext} from "react";
import {
    View,
    StyleSheet,
    FlatList,
    Alert,
    TouchableOpacity,
    Text,
} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {db} from "../../firebaseConfig";
import {
    collection,
    onSnapshot,
    deleteDoc,
    addDoc,
    query,
    where,
    getDocs,
    doc,
} from "firebase/firestore";
import {Ionicons} from "@expo/vector-icons";
import {AuthContext} from "../context/AuthProvider";
import {auth} from "../../firebaseConfig";
import EventCard from "../components/EventCard";

const HomeScreen = () => {
    const [events, setEvents] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const navigation = useNavigation();
    const {user} = useContext(AuthContext);

    useEffect(() => {
        if (!user) {
            return;
        }
    }, [user]);

    const fetchEventsLive = () => {
        const eventsRef = collection(db, "events");

        const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
            const fetchedEvents = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setEvents(fetchedEvents);
        });

        return unsubscribe;
    };

    const fetchFavoritesLive = () => {
        const favoritesRef = collection(db, "favorites");
        const q = query(favoritesRef, where("userId", "==", user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const favoriteIds = snapshot.docs.map((doc) => doc.data().id);
            setFavorites(favoriteIds);
        });

        return unsubscribe;
    };

    const toggleFavorite = async (event) => {
        try {
            const isFavorite = favorites.includes(event.id);

            if (isFavorite) {
                const favoritesRef = collection(db, "favorites");
                const q = query(
                    favoritesRef,
                    where("id", "==", event.id),
                    where("userId", "==", user.uid)
                );
                const snapshot = await getDocs(q);
                snapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });
            } else {
                await addDoc(collection(db, "favorites"), {
                    ...event,
                    userId: user.uid,
                });
            }
        } catch (error) {
            Alert.alert("Error toggling favorite: " + error.message);
        }
    };

    const deleteEvent = async (id) => {
        try {
            await deleteDoc(doc(db, "events", id));

            const favoritesRef = collection(db, "favorites");
            const q = query(favoritesRef, where("id", "==", id));
            const snapshot = await getDocs(q);

            snapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            Alert.alert("Event and its favorites deleted successfully!");
        } catch (error) {
            Alert.alert("Error deleting event: " + error.message);
        }
    };

    const onEditEvent = (event) => {
        navigation.navigate("EventForm", {event});
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            Alert.alert("Error", "Could not sign out: " + error.message);
        }
    };

    useEffect(() => {
        const unsubscribeEvents = fetchEventsLive();
        const unsubscribeFavorites = fetchFavoritesLive();
        return () => {
            unsubscribeEvents();
            unsubscribeFavorites();
        };
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Event Manager</Text>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => navigation.navigate("EventForm")}>
                        <Ionicons name="add-circle-outline" size={32} color="#28A745"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSignOut}>
                        <Ionicons name="exit-outline" size={28} color="#E63946"/>
                    </TouchableOpacity>
                </View>
            </View>

            {events.length === 0 ? (
                <Text style={styles.noEventsText}>No events available</Text>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <EventCard
                            event={item}
                            onToggleFavorite={toggleFavorite}
                            isFavorite={favorites.includes(item.id)}
                            currentUserId={user?.uid}
                            onDelete={deleteEvent}
                            onEdit={onEditEvent}
                        />
                    )}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: "#F5F5F5",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#DDD",
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    list: {
        paddingTop: 10,
    },
    noEventsText: {
        fontSize: 18,
        textAlign: "center",
        color: "#777",
        marginTop: 50,
    },
});

export default HomeScreen;