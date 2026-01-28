// database.js
import { menuData } from "../assets/menuData"; // Import your data

export const migrateDbIfNeeded = async (db) => {
  const DATABASE_VERSION = 1;

  // 1. Check current version
  let { user_version: currentDbVersion } = await db.getFirstAsync(
    "PRAGMA user_version",
  );

  console.log("Current DB Version:", currentDbVersion);

  // 2. If already up to date, stop.
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  // 3. If version is 0 (New User), Initialize & Seed
  if (currentDbVersion === 0) {
    console.log("Initializing Database...");

    // A. Create Table
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY NOT NULL, 
        name TEXT NOT NULL, 
        price TEXT NOT NULL, 
        description TEXT NOT NULL, 
        image TEXT NOT NULL,
        category TEXT NOT NULL
      );
    `);

    // B. Seed Data (Insert the menu items)
    console.log("Seeding data...");
    for (const item of menuData) {
      await db.runAsync(
        "INSERT INTO menu (id, name, price, description, image, category) VALUES (?, ?, ?, ?, ?, ?)",
        [
          item.id,
          item.name,
          item.price,
          item.description,
          item.image,
          item.category,
        ],
      );
    }

    // C. Update Version so we don't do this again
    currentDbVersion = 1;
  }

  // 4. Finalize version
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};
export async function filterByQueryAndCategories(db, query, activeCategory) {
  try {
    const searchPart = `%${query}%`;

    if (activeCategory === "All") {
      // 1. Search Only (Category is All)
      return await db.getAllAsync("SELECT * FROM menu WHERE name LIKE ?", [
        searchPart,
      ]);
    } else {
      // 2. Search + Category Filter
      return await db.getAllAsync(
        "SELECT * FROM menu WHERE name LIKE ? AND category = ?",
        [searchPart, activeCategory],
      );
    }
  } catch (error) {
    console.error("Filter error:", error);
    return [];
  }
}
