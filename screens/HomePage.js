import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import MainPageScreen from "./MainPage";
import ProfileScreen from "./Profile";

const Tab = createBottomTabNavigator();

export default function HomePage({ logout }) {
  console.log("HomePage received logout prop?", !!logout);
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#495E57", // Little Lemon Green
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="Home"
          component={MainPageScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen name="Profile" options={{ headerShown: false }}>
          {() => <ProfileScreen logout={logout} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}
