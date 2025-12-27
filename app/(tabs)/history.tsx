import { useHistoryStore } from "@/stores/historyStore";
import { ITransaction } from "@/types/Transaction";
import { FlashList } from "@shopify/flash-list";
import { Receipt, X } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Modal, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import HistoryItem from "../../components/HistoryItem";
import ScreenWrapper from "../../components/ScreenWrapper";

export default function HistoryScreen() {
  const { data, fetchHistory, isError, isLoading } = useHistoryStore();

  const [selectedTrx, setSelectedTrx] = useState<ITransaction | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHistory(true);
    setRefreshing(false);
  }, []);

  const handlePressItem = (item: ITransaction) => {
    setSelectedTrx(item);
    setModalVisible(true);
  };
  return (
    <ScreenWrapper className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      <View className="px-6 pt-4 pb-4 mb-2 bg-white border-b border-slate-100">
        <Text className="text-2xl font-bold text-slate-800">Riwayat Transaksi</Text>
        <Text className="mt-1 text-sm text-slate-500">Total: {data.length} Transaksi tersimpan</Text>
      </View>

      {isLoading && data.length === 0 ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="mt-2 text-slate-400">Memuat data...</Text>
        </View>
      ) : isError ? (
        // State Error
        <View className="items-center justify-center flex-1">
          <Text className="mb-2 text-red-500">Gagal memuat data</Text>
          <TouchableOpacity onPress={() => fetchHistory(true)} className="px-4 py-2 bg-blue-600 rounded-full">
            <Text className="text-white">Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlashList<ITransaction>
          data={data}
          onRefresh={onRefresh}
          refreshing={refreshing}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
          renderItem={({ item }) => <HistoryItem item={item} onPress={() => handlePressItem(item)} />}
          ListEmptyComponent={() => (
            <View className="items-center justify-center mt-20 opacity-50">
              <Receipt size={64} color="#CBD5E1" />
              <Text className="mt-4 font-bold text-slate-400">Belum ada transaksi</Text>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between p-5 border-b border-slate-100">
            <Text className="text-xl font-bold text-slate-800">Detail Transaksi</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} className="p-2 rounded-full bg-slate-100">
              <X size={20} color="black" />
            </TouchableOpacity>
          </View>

          {selectedTrx && (
            <ScrollView className="p-6">
              <View className="items-center mb-8">
                <Text className="mb-1 text-sm text-slate-500">Total Pembayaran</Text>
                <Text className="text-3xl font-bold text-slate-800">Rp {selectedTrx.total_price.toLocaleString("id-ID")}</Text>
                <View className="px-3 py-1 mt-3 bg-green-100 rounded-full">
                  <Text className="text-xs font-bold text-green-700">PEMBAYARAN SUKSES</Text>
                </View>
              </View>

              <View className="pt-4 border-t border-slate-100">
                <Text className="mb-4 font-bold text-slate-800">Rincian Pesanan</Text>
                {selectedTrx.items.map((barang, index) => (
                  <View key={index} className="flex-row justify-between mb-4">
                    <View className="flex-1 mr-4">
                      <Text className="text-base font-medium text-slate-800">{barang.name}</Text>
                      <Text className="text-slate-400 text-sm mt-0.5">
                        {barang.quantity} x Rp {barang.current_price.toLocaleString("id-ID")}
                      </Text>
                    </View>
                    <Text className="font-bold text-slate-700">Rp {barang.subtotal.toLocaleString("id-ID")}</Text>
                  </View>
                ))}
              </View>

              <View className="pt-4 mt-4 mb-10 space-y-2 border-t border-dashed border-slate-300">
                <View className="flex-row justify-between">
                  <Text className="text-slate-500">Uang Tunai</Text>
                  <Text className="font-medium text-slate-800">Rp {selectedTrx.money_receive.toLocaleString("id-ID")}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-slate-500">Kembalian</Text>
                  <Text className="font-bold text-blue-600">Rp {selectedTrx.money_return.toLocaleString("id-ID")}</Text>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
