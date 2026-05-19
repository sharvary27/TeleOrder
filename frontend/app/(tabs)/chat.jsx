import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import TypingIndicator from "../../components/TypingIndicator";
import QuickReplies from "../../components/QuickReplies";

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const { cart, addToCart, clearCart, removeByName, updateByName } = useCart();
  const { isDark } = useTheme();
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      text: "Hey there! 👋 I'm TeleOrder. Tell me what you'd like to eat and I'll add it to your cart!",
    },
  ]);
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const getSuggestions = () => {
    if (cart.length === 0) {
      return ["Show menu", "What's popular?", "Surprise me!"];
    }
    return ["Add more", "View cart", "Clear cart", "Place order"];
  };

  const handleQuickReply = (text) => {
    if (text === "Clear cart") {
      clearCart();
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", text: "Cart cleared! 🗑️ What would you like to order?" },
      ]);
      return;
    }

    if (text === "View cart") {
      if (cart.length === 0) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: "assistant", text: "Your cart is empty! Try adding something 😊" },
        ]);
      } else {
        const cartSummary = cart
          .map(
            (item) =>
              `${item.quantity}x ${item.item}${item.variant ? ` (${item.variant})` : ""} — $${item.totalPrice.toFixed(2)}`
          )
          .join("\n");
        const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            text: `Here's your cart:\n\n${cartSummary}\n\nTotal: $${total.toFixed(2)}`,
          },
        ]);
      }
      return;
    }

    if (text === "Place order") {
      if (cart.length === 0) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: "assistant", text: "Your cart is empty! Add some items first 🍔" },
        ]);
      } else {
        const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            text: `Order placed! 🎉 Your total is $${total.toFixed(2)}. Thanks for ordering with TeleOrder!`,
          },
        ]);
        clearCart();
      }
      return;
    }

    setInput(text);
    setTimeout(() => {
      const userMessage = { id: Date.now().toString(), role: "user", text };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);

      fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          cart,
          history: [...messages, userMessage].map((m) => ({ role: m.role, content: m.text })),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.response.actions) {
            data.response.actions.forEach((action) => {
              if (action.type === "add") addToCart(action);
              else if (action.type === "remove") removeByName(action.item);
              else if (action.type === "update") updateByName(action.item, action);
              else if (action.type === "clear") clearCart();
            });
          }
          setMessages((prev) => [
            ...prev,
            { id: (Date.now() + 1).toString(), role: "assistant", text: data.response.reply, actions: data.response.actions },
          ]);
        })
        .catch(() => {
          setMessages((prev) => [
            ...prev,
            { id: (Date.now() + 1).toString(), role: "assistant", text: "Couldn't connect to the kitchen! 🔌" },
          ]);
        })
        .finally(() => setLoading(false));
    }, 100);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { id: Date.now().toString(), role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.text,
          cart,
          history: [...messages, userMessage].map((m) => ({ role: m.role, content: m.text })),
        }),
      });

      const data = await response.json();

      if (data.response.actions) {
        data.response.actions.forEach((action) => {
          if (action.type === "add") addToCart(action);
          else if (action.type === "remove") removeByName(action.item);
          else if (action.type === "update") updateByName(action.item, action);
          else if (action.type === "clear") clearCart();
        });
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", text: data.response.reply, actions: data.response.actions },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", text: "Couldn't connect to the kitchen! Make sure the backend is running and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === "user";
    return (
      <View className={`px-4 py-1.5 ${isUser ? "items-end" : "items-start"}`}>
        <View
          style={{ backgroundColor: isUser ? "#FF6B35" : isDark ? "#1f2937" : "#fff" }}
          className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser ? "rounded-br-none" : "rounded-bl-none"}`}
        >
          <Text style={{ color: isUser ? "#fff" : isDark ? "#f3f4f6" : "#1f2937" }} className="text-base">
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: isDark ? "#111827" : "#f3f4f6" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingVertical: 15 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {loading && <TypingIndicator />}

      {!loading && <QuickReplies suggestions={getSuggestions()} onPress={handleQuickReply} />}

      {/* Input Bar */}
      <View
        style={{
          backgroundColor: isDark ? "#1f2937" : "#fff",
          borderTopColor: isDark ? "#374151" : "#e5e7eb",
        }}
        className="flex-row items-center px-4 py-3 border-t"
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: isDark ? "#374151" : "#f3f4f6",
            color: isDark ? "#f3f4f6" : "#1f2937",
          }}
          className="rounded-full px-4 py-3 text-base mr-3"
          placeholder="What would you like to order?"
          placeholderTextColor={isDark ? "#9ca3af" : "#999"}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity
          className={`w-11 h-11 rounded-full justify-center items-center ${input.trim() ? "bg-orange-500" : "bg-gray-300"}`}
          onPress={sendMessage}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
