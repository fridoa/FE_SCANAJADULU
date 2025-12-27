import React from "react";
import { Text, View } from "react-native";

export default function ScannerOverlay() {
  return (
    <View className="absolute inset-0 justify-center items-center">
      <View className="absolute inset-0 bg-black/60" />

      <View className="w-72 h-72 border-2 border-white/80 rounded-2xl bg-transparent justify-center items-center relative overflow-hidden">
        <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 -mt-0.5 -ml-0.5 rounded-tl-lg" />
        <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 -mt-0.5 -mr-0.5 rounded-tr-lg" />
        <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 -mb-0.5 -ml-0.5 rounded-bl-lg" />
        <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 -mb-0.5 -mr-0.5 rounded-br-lg" />

        <View className="w-11/12 h-0.5 bg-red-500 opacity-80 animate-pulse shadow-lg shadow-red-500" />
      </View>

      <Text className="text-white font-medium mt-8 text-center bg-black/40 px-6 py-2 rounded-full overflow-hidden">Arahkan kamera ke barcode produk</Text>
    </View>
  );
}
