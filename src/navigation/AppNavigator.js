import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "../context/AuthProvider";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import EventFormScreen from "../screens/EventFormScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      let iconName;
      if (route.name === "Home") {
        iconName = "home-sharp"; // Updated icon for a bolder look
      } else if (route.name === "Favorites") {
        iconName = "heart"; // Updated icon to a filled heart
      }
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: "#FF6F61", // Vibrant color for active tabs
    tabBarInactiveTintColor: "#A9A9A9", // Subtle gray for inactive tabs
    tabBarStyle: {
      backgroundColor: "#FFF", // White background for tab bar
      borderTopWidth: 1,
      borderTopColor: "#E5E5E5", // Light gray border for separation
    },
    tabBarLabelStyle: {
      fontSize: 12, // Smaller font size for labels
      fontWeight: "600", // Medium weight for better readability
    },
  })}
>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Favorites" component={FavoritesScreen} />
</Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={HomeTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="EventForm" component={EventFormScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
