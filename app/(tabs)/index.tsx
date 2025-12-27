import { useRouter } from "expo-router";
import { Package, ShoppingCart, Store } from "lucide-react-native";
import React from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function HomeScreen() {
  const router = useRouter();

  const todayOmzet = 1250000;
  const totalTransactions = 45;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View className="px-6 pt-6 pb-6 bg-white border-b border-slate-100">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-sm font-medium text-slate-500">Selamat Bertugas,</Text>
            <Text className="text-2xl font-bold text-slate-800">Kasir Utama</Text>
          </View>

          <View className="items-center justify-center w-10 h-10 bg-blue-100 border border-blue-200 rounded-full">
            <Store size={20} color="#2563EB" />
          </View>
        </View>

        <View className="flex-row items-center justify-between p-4 shadow-sm bg-slate-900 rounded-2xl">
          <View>
            <Text className="mb-1 text-xs text-slate-400">Omzet Hari Ini</Text>
            <Text className="text-xl font-bold text-white">Rp {todayOmzet.toLocaleString("id-ID")}</Text>
          </View>
          <View className="h-8 w-[1px] bg-slate-700 mx-2" />
          <View>
            <Text className="mb-1 text-xs text-slate-400">Transaksi</Text>
            <Text className="text-xl font-bold text-white">{totalTransactions}</Text>
          </View>
        </View>
      </View>

      <View className="p-6">
        <Text className="mb-4 text-lg font-bold text-slate-800">Menu Utama</Text>
        <View className="flex-row flex-wrap justify-between">
          <TouchableOpacity onPress={() => router.push("/cashier")} className="w-[48%] bg-blue-600 h-44 rounded-3xl p-5 justify-between shadow-lg shadow-blue-200 mb-4 active:scale-95">
            <View className="items-center justify-center w-12 h-12 rounded-full bg-white/20">
              <ShoppingCart size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text className="text-xl font-bold text-white">Kasir</Text>
              <Text className="mt-1 text-xs text-blue-100">Buat transaksi penjualan baru</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/product")} className="w-[48%] bg-white h-44 rounded-3xl p-5 justify-between shadow-sm border border-slate-100 mb-4 active:scale-95">
            <View className="items-center justify-center w-12 h-12 bg-orange-100 rounded-full">
              <Package size={24} color="#F97316" />
            </View>
            <View>
              <Text className="text-xl font-bold text-slate-800">Produk</Text>
              <Text className="mt-1 text-xs text-slate-400">Stok & Harga Barang</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
