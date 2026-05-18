import { View, Text, ScrollView, TouchableOpacity } from "react-native";

export default function QuickReplies({ suggestions, onPress }) {
  return (
    <View className="px-4 py-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {suggestions.map((text) => (
          <TouchableOpacity
            key={text}
            style={{
              borderWidth: 1,
              borderColor: "#FF6B35",
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
            onPress={() => onPress(text)}
          >
            <Text className="text-orange-500 font-semibold text-sm">{text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}