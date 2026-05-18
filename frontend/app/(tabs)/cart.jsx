import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="bg-orange-500 pt-14 pb-4 px-5">
          <Text className="text-white text-2xl font-bold">Your Cart</Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <Text className="text-6xl mb-4">🛒</Text>
          <Text className="text-gray-400 text-lg">Your cart is empty</Text>
          <Text className="text-gray-300 text-sm mt-2">
            Order from the chat or menu!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-orange-500 pt-14 pb-4 px-5 flex-row justify-between items-end">
        <Text className="text-white text-2xl font-bold">Your Cart</Text>
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
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">
                  {item.item}
                </Text>
                <Text className="text-sm text-gray-400 mt-1">
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
                  className="w-8 h-8 rounded-full bg-gray-100 justify-center items-center"
                  onPress={() => updateQuantity(index, item.quantity - 1)}
                >
                  <Ionicons name="remove" size={18} color="#666" />
                </TouchableOpacity>

                <Text className="text-lg font-bold text-gray-800 w-6 text-center">
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
              className="mt-3 pt-3 border-t border-gray-100 flex-row items-center justify-center"
              onPress={() => removeFromCart(index)}
            >
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
              <Text className="text-red-500 text-sm ml-1">Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Total and Checkout */}
      <View className="bg-white px-5 pt-4 pb-8 border-t border-gray-200">
        <View className="flex-row justify-between mb-4">
          <Text className="text-gray-500 text-lg">Total</Text>
          <Text className="text-2xl font-bold text-gray-800">
            ${cartTotal.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity className="bg-orange-500 rounded-full py-4 items-center">
          <Text className="text-white text-lg font-bold">
            Place Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}