import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function ItemModal({ item, visible, onClose, onAdd }) {
  const [selectedVariant, setSelectedVariant] = useState(item?.variants ? item.variants[0] : null);
  const [selectedSize, setSelectedSize] = useState(item?.sizes ? "Regular" : null);
  const [quantity, setQuantity] = useState(1);
  const { isDark } = useTheme();

  if (!item) return null;

  const handleAdd = () => {
    onAdd({
      item: item.name,
      variant: selectedVariant,
      size: selectedSize,
      quantity,
      price: item.price,
      totalPrice: item.price * quantity,
    });
    setQuantity(1);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/40">
        <View
          style={{ backgroundColor: isDark ? "#1f2937" : "#fff" }}
          className="rounded-t-3xl px-5 pt-6 pb-10"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Text className="text-4xl mr-3">{item.emoji}</Text>
              <View>
                <Text style={{ color: isDark ? "#f3f4f6" : "#1f2937" }} className="text-xl font-bold">
                  {item.name}
                </Text>
                {item.allergens && item.allergens.length > 0 && (
                  <Text className="text-red-400 text-sm mt-1">Contains: {item.allergens.join(", ")}</Text>
                )}
              </View>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={32} color={isDark ? "#6b7280" : "#ccc"} />
            </TouchableOpacity>
          </View>

          {/* Variants */}
          {item.variants && (
            <View className="mb-4">
              <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }} className="font-semibold mb-2">Variant</Text>
              <View className="flex-row gap-2">
                {item.variants.map((v) => (
                  <TouchableOpacity
                    key={v}
                    style={{ backgroundColor: selectedVariant === v ? "#FF6B35" : isDark ? "#374151" : "#f3f4f6" }}
                    className="px-4 py-2 rounded-full"
                    onPress={() => setSelectedVariant(v)}
                  >
                    <Text style={{ color: selectedVariant === v ? "#fff" : isDark ? "#d1d5db" : "#4b5563" }} className="font-semibold">
                      {v}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Sizes */}
          {item.sizes && (
            <View className="mb-4">
              <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }} className="font-semibold mb-2">Size</Text>
              <View className="flex-row gap-2">
                {item.sizes.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={{ backgroundColor: selectedSize === s ? "#FF6B35" : isDark ? "#374151" : "#f3f4f6" }}
                    className="px-4 py-2 rounded-full"
                    onPress={() => setSelectedSize(s)}
                  >
                    <Text style={{ color: selectedSize === s ? "#fff" : isDark ? "#d1d5db" : "#4b5563" }} className="font-semibold">
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity */}
          <View className="mb-6">
            <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }} className="font-semibold mb-2">Quantity</Text>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                style={{ backgroundColor: isDark ? "#374151" : "#f3f4f6" }}
                className="w-10 h-10 rounded-full justify-center items-center"
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Ionicons name="remove" size={20} color={isDark ? "#d1d5db" : "#666"} />
              </TouchableOpacity>
              <Text style={{ color: isDark ? "#f3f4f6" : "#1f2937" }} className="text-2xl font-bold">{quantity}</Text>
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-orange-500 justify-center items-center"
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Add Button */}
          <TouchableOpacity className="bg-orange-500 rounded-full py-4 items-center" onPress={handleAdd}>
            <Text className="text-white text-lg font-bold">
              Add to Cart — ${(item.price * quantity).toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
