import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SQLiteProvider } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { migrateDbIfNeeded } from "./database/database";
import HomeScreen from "./screens/HomePage";
import OnboardingScreen from "./screens/Onboarding";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("isOnboarded");
        if (value !== null) {
          setIsOnboarded(true);
        }
      } catch (e) {
        console.error("Failed to load onboarding status.", e);
      } finally {
        setIsLoading(false);
      }
    };
    checkOnboardingStatus();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.clear(); // Clear data
      setIsOnboarded(false); // <--- This switches the Stack automatically!
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading Little Lemon...</Text>
      </View>
    );
  }

  if (isOnboarded) {
    return (
      <SQLiteProvider databaseName="little_lemon.db" onInit={migrateDbIfNeeded}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Home" options={{ headerShown: false }}>
                {(props) => (
                  <HomeScreen {...props} logout={() => setIsOnboarded(false)} />
                )}
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </SQLiteProvider>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
            {(props) => (
              <OnboardingScreen
                {...props}
                completeOnboarding={() => setIsOnboarded(true)}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
