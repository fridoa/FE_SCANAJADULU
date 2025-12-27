import formatRupiah from "@/utils/formatRupiah";
import { ChevronUp, Trash2 } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface CashierFooterProps {
  totalQty: number;
  totalPrice: number;
  onClear: () => void;
  onPay: () => void;
}

export default function CashierFooter({ totalQty, totalPrice, onClear, onPay }: CashierFooterProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-gray-100">
        <ChevronUp size={20} color="#374151" />
        <Text className="ml-2 font-bold text-gray-800 uppercase">Total ({totalQty} Item)</Text>
      </View>

      <TouchableOpacity onPress={onClear} className="flex-row items-center px-3 py-1 rounded-md bg-red-50">
        <Text className="mr-1 text-xs font-bold text-red-600">BATALKAN</Text>
        <Trash2 size={14} color="#DC2626" />
      </TouchableOpacity>

      <View className="p-4 pb-6">
        <TouchableOpacity onPress={onPay} className="items-center w-full py-4 bg-green-800 rounded-full shadow-lg active:bg-green-900">
          <Text className="text-lg font-bold text-white">Bayar {formatRupiah(totalPrice)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
