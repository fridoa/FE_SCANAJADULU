import { IProduct } from "@/types/Product";
import { Package } from "lucide-react-native";
import { Image, Text, View } from "react-native";

interface ProductCardProps {
  item: IProduct;
}

export default function ProductCard({ item }: ProductCardProps) {
  return (
    <View className="flex-row items-center p-4 mb-3 bg-white border border-gray-100 shadow-sm rounded-xl">
      <View className="items-center justify-center w-12 h-12 overflow-hidden bg-gray-100 rounded-lg">
        {item.image_url ? <Image source={{ uri: item.image_url }} className="w-full h-full" resizeMode="cover" /> : <Package size={24} color="#9CA3AF" />}
      </View>

      <View className="flex-1 ml-3">
        <Text className="font-bold text-gray-800" numberOfLines={1}>
          {item.name}
        </Text>
        <View className="flex-row gap-2 mt-1">
          <Text className="text-xs text-gray-500">Stok: {item.stock}</Text>
          <Text className="text-xs text-gray-400">|</Text>
          <Text className="text-xs text-gray-400">SKU: {item.sku}</Text>
        </View>
      </View>

      <Text className="font-bold text-green-700">Rp {Number(item.price).toLocaleString("id-ID")}</Text>
    </View>
  );
}
