import ProductCard from "@/components/ProductCard";
import { useDebounce } from "@/hooks/useDebounce";
import productService from "@/services/product.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ArrowLeft, Filter, Plus, Search } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
export default function ProductScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 500);

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["product", debouncedSearch], // Auto refetch saat debouncedSearch berubah
    queryFn: () => productService.getProduct(debouncedSearch),
  });

  return (
    <ScreenWrapper>
      <View className="flex-1">
        <View className="flex-row items-center gap-3 px-4 py-3 border-b border-gray-100">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>

          <View className="flex-row items-center flex-1 h-10 px-3 bg-gray-100 rounded-lg">
            <Search size={20} color="#9CA3AF" />
            <TextInput placeholder="Cari Produk..." className="flex-1 ml-2 text-gray-800" value={searchQuery} onChangeText={setSearchQuery} />
          </View>
          <TouchableOpacity>
            <Filter size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 p-4 bg-gray-50">
          {isLoading ? (
            <View className="items-center justify-center flex-1">
              <ActivityIndicator size="large" color="#15803d" />
            </View>
          ) : isError ? (
            <View className="items-center justify-center flex-1">
              <Text className="mb-2 text-lg font-bold text-red-600">Terjadi Kesalahan</Text>
              <Text className="mb-4 text-center text-gray-500">Gagal memuat data produk.</Text>
              <TouchableOpacity onPress={() => refetch()} className="px-4 py-2 bg-green-700 rounded-lg">
                <Text className="font-bold text-white">Coba Lagi</Text>
              </TouchableOpacity>
            </View>
          ) : product && product.length > 0 ? (
            <FlatList
              data={product}
              keyExtractor={(item, index) => item._id || item.id || index.toString()} // Sesuaikan ID dari backend
              renderItem={({ item }) => <ProductCard item={item} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 80 }}
              onRefresh={refetch}
              refreshing={isLoading}
            />
          ) : (
            <View className="items-center justify-center flex-1">
              <View className="items-center justify-center w-40 h-40 mb-6 bg-gray-200 rounded-full">
                <Search size={64} color="#9CA3AF" />
              </View>
              <Text className="mb-2 text-lg font-bold text-gray-800">Belum Ada Produk</Text>
              <Text className="text-center text-gray-500">{searchQuery ? "Produk yang dicari tidak ditemukan." : "Silakan tambahkan produk baru."}</Text>
            </View>
          )}
        </View>

        <View className="absolute bottom-8 right-6">
          <TouchableOpacity onPress={() => router.push("/product/addProduct")} className="flex-row items-center px-5 py-3 bg-green-700 rounded-full shadow-lg elevation-5">
            <Plus size={24} color="#FFFFFF" />
            <Text className="ml-2 font-bold text-white">Tambah</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}
