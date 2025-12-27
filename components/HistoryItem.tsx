import { ITransaction } from "@/types/Transaction";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Receipt } from "lucide-react-native";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

dayjs.locale("id");

interface HistoryItemProps {
  item: ITransaction;
  onPress?: () => void;
}

const HistoryItem = React.memo(({ item, onPress }: HistoryItemProps) => {
  const itemCount = useMemo(() => {
    return item.items?.reduce((acc, curr) => acc + curr.quantity, 0) || 0;
  }, [item.items]);

  const formattedDate = useMemo(() => {
    return dayjs(item.transaction_date).format("DD MMM, HH:mm");
  }, [item.transaction_date]);

  const formattedTotal = useMemo(() => {
    return item.total_price.toLocaleString("id-ID");
  }, [item.total_price]);

  const displayId = item._id ? item._id.slice(-6).toUpperCase() : "###";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="flex-row items-center justify-between p-4 mx-4 mb-3 bg-white border shadow-sm rounded-2xl border-slate-100">
      <View className="flex-row items-center flex-1 gap-3">
        <View className="items-center justify-center w-10 h-10 rounded-full bg-blue-50">
          <Receipt size={20} color="#3B82F6" />
        </View>

        <View className="flex-1">
          <Text className="text-base font-bold text-slate-800">#{displayId}</Text>
          <Text className="text-xs text-slate-400 mt-0.5">
            {formattedDate} • {itemCount} Barang
          </Text>
        </View>

        <View className="items-end">
          <Text className="text-base font-bold text-blue-600">Rp {formattedTotal}</Text>
          <View className="bg-green-100 px-2 py-0.5 rounded-md mt-1">
            <Text className="text-green-700 text-[10px] font-bold">LUNAS</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

HistoryItem.displayName = "HistoryItem";

export default HistoryItem;
