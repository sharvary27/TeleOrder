import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { isDark } = useTheme();

  if (cart.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: isDark ? "#111827" : "#f9fafb" }} className="justify-center items-center">
        <Text className="text-6xl mb-4">🛒</Text>
        <Text style={{ color: isDark ? "#6b7280" : "#9ca3af" }} className="text-lg">Your cart is empty</Text>
        <Text style={{ color: isDark ? "#4b5563" : "#d1d5db" }} className="text-sm mt-2">
          Order from the chat or menu!
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#111827" : "#f9fafb" }}>

      <View className="bg-orange-500 pt-14 pb-4 px-5 flex-row justify-between items-end">
        <TouchableOpacity onPress={clearCart}>
          <Text className="text-orange-100 text-sm">Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Cart Items */}
      <FlatList
        data={cart}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ padding: 15, gap: 12 }}
        renderItem={({ item, index }) => (
          <View
            style={{ backgroundColor: isDark ? "#1f2937" : "#fff" }}
            className="rounded-2xl p-4 shadow-sm"
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text style={{ color: isDark ? "#f3f4f6" : "#1f2937" }} className="text-lg font-bold">
                  {item.item}
                </Text>
                <Text style={{ color: isDark ? "#6b7280" : "#9ca3af" }} className="text-sm mt-1">
                  {item.variant ? item.variant : ""}
                  {item.variant && item.size ? " · " : ""}
                  {item.size ? item.size : ""}
                </Text>
                <Text className="text-orange-500 font-semibold mt-1">
                  ${item.totalPrice.toFixed(2)}
                </Text>
              </View>

              {/* Quantity Controls */}
              <View className="flex-row items-center gap-3">
                <TouchableOpacity
                  style={{ backgroundColor: isDark ? "#374151" : "#f3f4f6" }}
                  className="w-8 h-8 rounded-full justify-center items-center"
                  onPress={() => updateQuantity(index, item.quantity - 1)}
                >
                  <Ionicons name="remove" size={18} color={isDark ? "#d1d5db" : "#666"} />
                </TouchableOpacity>

                <Text style={{ color: isDark ? "#f3f4f6" : "#1f2937" }} className="text-lg font-bold w-6 text-center">
                  {item.quantity}
                </Text>

                <TouchableOpacity
                  className="w-8 h-8 rounded-full bg-orange-500 justify-center items-center"
                  onPress={() => updateQuantity(index, item.quantity + 1)}
                >
                  <Ionicons name="add" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remove Button */}
            <TouchableOpacity
              style={{ borderTopColor: isDark ? "#374151" : "#f3f4f6" }}
              className="mt-3 pt-3 border-t flex-row items-center justify-center"
              onPress={() => removeFromCart(index)}
            >
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
              <Text className="text-red-500 text-sm ml-1">Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Total and Checkout */}
      <View
        style={{
          backgroundColor: isDark ? "#1f2937" : "#fff",
          borderTopColor: isDark ? "#374151" : "#e5e7eb",
        }}
        className="px-5 pt-4 pb-8 border-t"
      >
        <View className="flex-row justify-between mb-4">
          <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }} className="text-lg">Total</Text>
          <Text style={{ color: isDark ? "#f3f4f6" : "#1f2937" }} className="text-2xl font-bold">
            ${cartTotal.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity className="bg-orange-500 rounded-full py-4 items-center">
          <Text className="text-white text-lg font-bold">Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
