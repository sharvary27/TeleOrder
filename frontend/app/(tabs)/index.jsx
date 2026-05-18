import { View, Text, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import ItemModal from "../../components/ItemModal";
import menu from "../../constants/menu";
import { Ionicons } from "@expo/vector-icons";

const categories = ["All", "Mains", "Sides", "Drinks"];

export default function MenuScreen() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { addToCart, cart, updateQuantity } = useCart();
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
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Search Bar */}
      <View className="px-4 pt-14 pb-2 bg-white">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
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
      <View className="flex-row px-4 py-3 gap-2 bg-white">
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            className={`px-4 py-2 rounded-full ${
              activeCategory === cat ? "bg-orange-500" : "bg-gray-100"
            }`}
            onPress={() => setActiveCategory(cat)}
          >
            <Text
              className={`font-semibold ${
                activeCategory === cat ? "text-white" : "text-gray-500"
              }`}
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
            <View className="flex-row items-center bg-white rounded-2xl p-4 shadow-sm">
              <Text className="text-4xl mr-4">{item.emoji}</Text>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">
                  {item.name}
                </Text>
                <Text className="text-base font-semibold text-orange-500 mt-0.5">
                  ${item.price.toFixed(2)}
                </Text>
                <Text className="text-xs text-gray-400 mt-1">
                  {item.variants
                    ? item.variants.join(" · ")
                    : item.sizes.join(" · ")}
                </Text>
              </View>

              {cartItem ? (
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    className="w-8 h-8 rounded-full bg-gray-200 justify-center items-center"
                    onPress={() => updateQuantity(cart.indexOf(cartItem), cartItem.quantity - 1)}
                  >
                    <Text className="text-gray-600 text-lg font-bold">-</Text>
                  </TouchableOpacity>

                  <Text className="text-base font-bold text-gray-800 w-6 text-center">
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

      {/* Modal - outside FlatList, renders once */}
      <ItemModal
        item={selectedItem}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addToCart}
      />
    </KeyboardAvoidingView>
  );
}