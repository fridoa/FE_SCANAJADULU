import ScreenWrapper from "@/components/ScreenWrapper";
import { ITransaction } from "@/types/Transaction";
import formatRupiah from "@/utils/formatRupiah";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, CheckCircle, Printer } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function SuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  let transaction: ITransaction | null = null;
  try {
    transaction = params.data ? JSON.parse(params.data as string) : null;
  } catch (e) {
    console.error("Failed to parse transaction data", e);
  }

  const handleBackToHome = () => {
    if (router.canGoBack()) {
      router.dismiss(2);
    } else {
      router.replace("/cashier");
    }
  };

  if (!transaction) {
    return (
      <ScreenWrapper bg="#FFFFFF">
        <View className="items-center justify-center flex-1 p-6">
          <Text className="mb-4 text-gray-500">Data transaksi tidak ditemukan.</Text>
          <TouchableOpacity onPress={handleBackToHome} className="px-6 py-3 rounded-full bg-emerald-50">
            <Text className="font-bold text-emerald-600">Kembali ke Kasir</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bg="#FFFFFF">
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={handleBackToHome} className="p-1 mr-3">
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Transaksi Berhasil</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="items-center justify-center mb-10">
          <View className="p-1 mb-4 bg-green-100 rounded-full">
            <CheckCircle size={80} color="#10B981" fill="#DCFCE7" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">Pembayaran Lunas</Text>
          <Text className="mt-2 text-gray-500">
            {new Date(transaction.transaction_date).toLocaleString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <View className="px-6 space-y-4">
          <View className="flex-row justify-between">
            <Text className="text-gray-500">Nama Pelanggan</Text>
            <Text className="font-bold text-gray-800">Umum</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500">Metode Bayar</Text>
            <Text className="font-bold text-gray-800">Tunai</Text>
          </View>

          <View className="h-[1px] bg-gray-200 my-3">
            <View className="flex-row justify-between">
              <Text className="text-base text-gray-500">Total Tagihan</Text>
              <Text className="text-base font-bold text-gray-800">{formatRupiah(transaction.total_price)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-base text-gray-500">Uang Diterima</Text>
              <Text className="text-base font-bold text-gray-800">{formatRupiah(transaction.money_receive)}</Text>
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-lg font-medium text-gray-500">Kembalian</Text>
              <Text className="text-lg font-bold text-emerald-600">{formatRupiah(transaction.money_return)}</Text>
            </View>
          </View>

          <View className="px-6 mt-12 mb-8">
            <TouchableOpacity className="flex-row items-center justify-center py-4 bg-white border rounded-full shadow-sm border-emerald-200 active:bg-gray-50">
              <Printer size={20} color="#059669" className="mr-2" />
              <Text className="text-base font-bold text-emerald-700">Cetak Struk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
