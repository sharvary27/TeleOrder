import { View, Text, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import ItemModal from "../../components/ItemModal";
import menu from "../../constants/menu";
import { Ionicons } from "@expo/vector-icons";

const categories = ["All", "Mains", "Sides", "Drinks"];

export default function MenuScreen() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { addToCart, cart, updateQuantity } = useCart();
  const { isDark } = useTheme();
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMenu = menu.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: isDark ? "#111827" : "#f9fafb" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Search Bar */}
      <View style={{ backgroundColor: isDark ? "#1f2937" : "#fff" }} className="px-4 pt-14 pb-2">
        <View
          style={{ backgroundColor: isDark ? "#374151" : "#f3f4f6" }}
          className="flex-row items-center rounded-full px-4 py-2"
        >
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={{ color: isDark ? "#f3f4f6" : "#1f2937" }}
            className="flex-1 ml-2 text-base"
            placeholder="Search menu..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <View style={{ backgroundColor: isDark ? "#1f2937" : "#fff" }} className="flex-row px-4 py-3 gap-2">
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={{
              backgroundColor: activeCategory === cat ? "#FF6B35" : isDark ? "#374151" : "#f3f4f6",
            }}
            className="px-4 py-2 rounded-full"
            onPress={() => setActiveCategory(cat)}
          >
            <Text
              style={{ color: activeCategory === cat ? "#fff" : isDark ? "#d1d5db" : "#6b7280" }}
              className="font-semibold"
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Menu Items */}
      <FlatList
        data={filteredMenu}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 15, gap: 12 }}
        renderItem={({ item }) => {
          const cartItem = cart.find((c) => c.item === item.name);

          return (
            <View
              style={{ backgroundColor: isDark ? "#1f2937" : "#fff" }}
              className="flex-row items-center rounded-2xl p-4 shadow-sm"
            >
              <Text className="text-4xl mr-4">{item.emoji}</Text>
              <View className="flex-1">
                <Text style={{ color: isDark ? "#f3f4f6" : "#1f2937" }} className="text-lg font-bold">
                  {item.name}
                </Text>
                <Text className="text-base font-semibold text-orange-500 mt-0.5">
                  ${item.price.toFixed(2)}
                </Text>
                {item.allergens && item.allergens.length > 0 && (
                  <Text className="text-xs text-red-400 mt-1">{item.allergens.join(", ")}</Text>
                )}
              </View>

              {cartItem ? (
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    style={{ backgroundColor: isDark ? "#4b5563" : "#e5e7eb" }}
                    className="w-8 h-8 rounded-full justify-center items-center"
                    onPress={() => updateQuantity(cart.indexOf(cartItem), cartItem.quantity - 1)}
                  >
                    <Text style={{ color: isDark ? "#e5e7eb" : "#4b5563" }} className="text-lg font-bold">-</Text>
                  </TouchableOpacity>

                  <Text style={{ color: isDark ? "#f3f4f6" : "#1f2937" }} className="text-base font-bold w-6 text-center">
                    {cartItem.quantity}
                  </Text>

                  <TouchableOpacity
                    className="w-8 h-8 rounded-full bg-orange-500 justify-center items-center"
                    onPress={() => addToCart({ item: item.name, variant: item.variants ? item.variants[0] : null, price: item.price, quantity: 1, totalPrice: item.price })}
                  >
                    <Text className="text-white text-lg font-bold">+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  className="w-9 h-9 rounded-full bg-orange-500 justify-center items-center"
                  onPress={() => {
                    setSelectedItem(item);
                    setModalVisible(true);
                  }}
                >
                  <Text className="text-white text-xl font-bold">+</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />

      <ItemModal
        item={selectedItem}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addToCart}
      />
    </KeyboardAvoidingView>
  );
}
