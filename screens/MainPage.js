import { ThemedText } from "@/components/themed-text";
import { Image } from "expo-image";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Searchbar } from "react-native-paper";
import { itemImages } from "../assets/menuData";
import { filterByQueryAndCategories } from "../database/database";

export default function MainPage() {
  const db = useSQLiteContext();
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const logoImage = require("../assets/images/little-lemon-logo.png");
  const mainImage = require("@/assets/images/Main-Image.png");

  const categories = ["All", "Starters", "Mains", "Desserts"];

  const loadFilteredMenu = useCallback(async () => {
    if (!db) return; // Safety check
    try {
      const data = await filterByQueryAndCategories(
        db,
        searchQuery,
        selectedCategory,
      );
      setMenuItems(data);
    } catch (e) {
      console.error(e);
    }
  }, [db, searchQuery, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadFilteredMenu();
    }, 100);

    return () => clearTimeout(timer);
  }, [loadFilteredMenu]);

  const cachedHeader = useMemo(
    () => (
      <View>
        {/* Navigation Bar */}
        <View style={styles.navigationBar}>
          <Image source={logoImage} style={styles.logo} />
          <ThemedText style={styles.navTitle}>Little Lemon</ThemedText>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <View style={styles.heroTextContainer}>
              <ThemedText style={styles.restaurantName}>
                LITTLE LEMON
              </ThemedText>
              <ThemedText style={styles.location}>CHICAGO</ThemedText>
              <ThemedText style={styles.description}>
                We are a family owned Mediterranean restaurant, focused on
                traditional recipes served with a modern twist.
              </ThemedText>
              <Searchbar
                placeholder="Search menu items..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
                inputStyle={styles.searchInput}
                iconColor="#495E57"
              />
            </View>
            <View style={styles.heroImageContainer}>
              <Image
                source={mainImage}
                style={styles.heroImage}
                contentFit="cover"
              />
            </View>
          </View>
        </View>

        {/* Menu Breakdown Section */}
        <View style={styles.menuBreakdownSection}>
          <ThemedText style={styles.sectionTitle}>MENU ITEMS</ThemedText>
          {/* Horizontal ScrollView IS allowed inside Header */}
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            renderItem={({ item: category }) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  selectedCategory === category &&
                    styles.selectedCategoryButton,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category &&
                      styles.selectedCategoryText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    ),
    [searchQuery, selectedCategory],
  );

  return (
    <View style={styles.container}>
      {/* 2. The Main FlatList controls the WHOLE page scrolling */}
      <FlatList
        data={menuItems}
        ListEmptyComponent={<Text>Loading menu...</Text>}
        keyExtractor={(item) => item.id.toString()}
        // HERE IS THE MAGIC FIX:
        ListHeaderComponent={cachedHeader}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemText}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <Text style={styles.itemPrice}>{item.price}</Text>
              </View>
              <View style={styles.menuItemImageContainer}>
                {/* Make sure item.image matches the key in itemImages object (e.g. 'greekSalad') */}
                <Image
                  source={itemImages[item.image]}
                  style={styles.menuItemImage}
                />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  navigationBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  logo: {
    width: 40,
    height: 40,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#495E57",
    flex: 1,
    textAlign: "center",
  },
  profileButton: {
    padding: 5,
  },
  heroSection: {
    backgroundColor: "#495E57",
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 15,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F4CE14",
    marginBottom: 5,
  },
  location: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    elevation: 0,
  },
  searchInput: {
    fontSize: 14,
  },
  heroImageContainer: {
    width: 120,
    height: 100,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  menuBreakdownSection: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  categoriesContainer: {
    flexDirection: "row",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedCategoryButton: {
    backgroundColor: "#495E57",
    borderColor: "#495E57",
  },
  categoryText: {
    fontSize: 14,
    color: "#333333",
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#FFFFFF",
  },
  menuItemsSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  menuItem: {
    backgroundColor: "#FFFFFF",
    marginBottom: 15,
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  menuItemText: {
    flex: 1,
    paddingRight: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 18,
    marginBottom: 10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#495E57",
  },
  menuItemImageContainer: {
    width: 80,
    height: 80,
  },
  menuItemImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
});
