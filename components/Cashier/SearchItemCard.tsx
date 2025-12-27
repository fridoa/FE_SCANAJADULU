import { IProduct } from "@/types/Product";
import formatRupiah from "@/utils/formatRupiah";
import { PackageOpen, Plus } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface SearchItemCardProps {
  item: IProduct;
  onPress: (item: IProduct) => void;
}

export default function SearchItemCard({ item, onPress }: SearchItemCardProps) {

  return (
    <TouchableOpacity onPress={() => onPress(item)} className="flex-row items-center p-4 mb-2 bg-white border border-gray-100 shadow-sm rounded-xl active:bg-gray-50">
      <View className="mr-3 overflow-hidden bg-gray-200 rounded-lg w-14 h-14">
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} className="w-full h-full" />
        ) : (
          <View className="items-center justify-center w-full h-full bg-gray-300">
            <PackageOpen size={20} color="white" />
          </View>
        )}
      </View>

      <View className="flex-1">
        <Text className="font-bold text-gray-800" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="font-medium text-green-700">{formatRupiah(Number(item.price))}</Text>
      </View>

      <View className="p-2 rounded-full bg-green-50">
        <Plus size={20} color="#15803d" />
      </View>
    </TouchableOpacity>
  );
}
