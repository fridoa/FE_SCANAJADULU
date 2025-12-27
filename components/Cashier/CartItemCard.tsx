import { IProduct } from "@/types/Product";
import formatRupiah from "@/utils/formatRupiah";
import { Minus, PackageOpen, Plus } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CartItem extends IProduct {
  qty: number;
}

interface CartItemCardProps {
  item: CartItem;
  onUpdateQty: (itemId: string, delta: number) => void;
}

export default function CartItemCard({ item, onUpdateQty }: CartItemCardProps) {
  const itemId = item._id || item.id || "";

  return (
    <View className="flex-row items-center p-3 mb-3 bg-white border-b shadow-sm rounded-xl border-gray-50">
      <View className="mr-3 overflow-hidden bg-gray-200 rounded-lg w-14 h-14">
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="items-center justify-center w-full h-full bg-gray-300">
            <PackageOpen size={24} color="white" />
          </View>
        )}
      </View>

      <View className="flex-1 pr-2">
        <Text numberOfLines={2} className="mb-1 text-base font-bold text-gray-800">
          {item.name}
        </Text>
        <Text className="font-medium text-gray-500">{formatRupiah(Number(item.price))}</Text>
      </View>

      <View className="flex-row items-center bg-gray-100 rounded-lg">
        <TouchableOpacity onPress={() => onUpdateQty(itemId, -1)} className="p-2 rounded-l-lg active:bg-gray-200">
          <Minus size={16} color="#374151" />
        </TouchableOpacity>

        <View className="items-center w-8">
          <Text className="font-bold text-gray-800">{item.qty}</Text>
        </View>

        <TouchableOpacity onPress={() => onUpdateQty(itemId, 1)} activeOpacity={0.6} className="p-2 border-l border-gray-200 rounded-r-lg active:bg-gray-200">
          <Plus size={16} color="#15803d" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
