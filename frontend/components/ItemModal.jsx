import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function ItemModal({ item, visible, onClose, onAdd }) {
  const [selectedVariant, setSelectedVariant] = useState(
    item?.variants ? item.variants[0] : null
  );
  const [selectedSize, setSelectedSize] = useState(
    item?.sizes ? "Regular" : null
  );
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const handleAdd = () => {
    onAdd({
      item: item.name,
      variant: selectedVariant,
      size: selectedSize,
      quantity: quantity,
      price: item.price,
      totalPrice: item.price * quantity,
    });
    setQuantity(1);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-3xl px-5 pt-6 pb-10">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Text className="text-4xl mr-3">{item.emoji}</Text>
              <View>
                <Text className="text-xl font-bold text-gray-800">
                  {item.name}
                </Text>
                <Text className="text-orange-500 font-semibold text-lg">
                  ${item.price.toFixed(2)}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={32} color="#ccc" />
            </TouchableOpacity>
          </View>

          {/* Variants */}
          {item.variants && (
            <View className="mb-4">
              <Text className="text-gray-500 font-semibold mb-2">Variant</Text>
              <View className="flex-row gap-2">
                {item.variants.map((v) => (
                  <TouchableOpacity
                    key={v}
                    className={`px-4 py-2 rounded-full ${
                      selectedVariant === v ? "bg-orange-500" : "bg-gray-100"
                    }`}
                    onPress={() => setSelectedVariant(v)}
                  >
                    <Text
                      className={`font-semibold ${
                        selectedVariant === v ? "text-white" : "text-gray-600"
                      }`}
                    >
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
              <Text className="text-gray-500 font-semibold mb-2">Size</Text>
              <View className="flex-row gap-2">
                {item.sizes.map((s) => (
                  <TouchableOpacity
                    key={s}
                    className={`px-4 py-2 rounded-full ${
                      selectedSize === s ? "bg-orange-500" : "bg-gray-100"
                    }`}
                    onPress={() => setSelectedSize(s)}
                  >
                    <Text
                      className={`font-semibold ${
                        selectedSize === s ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity */}
          <View className="mb-6">
            <Text className="text-gray-500 font-semibold mb-2">Quantity</Text>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Ionicons name="remove" size={20} color="#666" />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-gray-800">{quantity}</Text>
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-orange-500 justify-center items-center"
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Add Button */}
          <TouchableOpacity
            className="bg-orange-500 rounded-full py-4 items-center"
            onPress={handleAdd}
          >
            <Text className="text-white text-lg font-bold">
              Add to Cart — ${(item.price * quantity).toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}