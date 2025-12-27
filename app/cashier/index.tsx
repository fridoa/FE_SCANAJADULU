import CartItemCard from "@/components/Cashier/CartItemCard";
import CashierFooter from "@/components/Cashier/CashierFooter";
import SearchItemCard from "@/components/Cashier/SearchItemCard";
import BarcodeScanner from "@/components/Scanner/BarcodeScanner";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useDebounce } from "@/hooks/useDebounce";
import productService from "@/services/product.service";
import { useCartStore } from "@/stores/cartStore";
import { IProduct } from "@/types/Product";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ArrowLeft, PackageOpen, ScanLine, Search, X } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, FlatList, Keyboard, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CashierScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const isSearching = searchQuery.length > 0;

  const { cart, addToCart, updateQty, clearCart, getTotalPrice, getTotalQty } = useCartStore();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["product", debouncedSearch],
    queryFn: () => productService.getProduct(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });

  const handleSelectProduct = (item: IProduct) => {
    addToCart(item);
    setSearchQuery("");
    Keyboard.dismiss();
  };

  const handlePay = () => {
    if (cart.length === 0) return;
    router.push("/cashier/payment");
    console.log("Bayar", getTotalPrice());
  };

  const handleScan = async (code: string) => {
    setShowScanner(false);

    try {
      const results = await productService.getProduct(code);

      if (results && results.length > 0) {
        const product = results[0];

        addToCart(product);
        Alert.alert("Sukses", `${product.name} berhasil ditambahkan ke keranjang.`);
      } else {
        Alert.alert("Tidak Ditemukan", `Produk dengan SKU/Barcode ${code} tidak ditemukan.`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Gagal memproses hasil scan.");
    }
  };

  return (
    <ScreenWrapper bg="#F9FAFB">
      <View className="z-10 flex-row items-center justify-between px-4 py-3 bg-white shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">Buat Order</Text>
        </View>
        <TouchableOpacity onPress={() => setShowScanner(true)}>
          <ScanLine size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <View className="flex-row items-center h-12 px-4 border border-gray-200 bg-gray-50 rounded-xl">
          <Search size={20} color="#9CA3AF" />
          <TextInput placeholder="Cari produk (Ketik nama/sku)..." className="flex-1 ml-2 text-base text-gray-800" value={searchQuery} onChangeText={setSearchQuery} />
          {isSearching && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="flex-1 px-4 pt-2">
        {isSearching ? (
          <>
            <Text className="mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Hasil Pencarian</Text>
            {isLoading ? (
              <ActivityIndicator size="large" color="#15803d" className="mt-10" />
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item._id || item.id || Math.random().toString()}
                renderItem={({ item }) => <SearchItemCard item={item} onPress={handleSelectProduct} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                  <View className="items-center mt-10">
                    <Text className="text-gray-400">Produk tidak ditemukan</Text>
                  </View>
                }
              />
            )}
          </>
        ) : (
          <>
            <Text className="mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">Daftar Produk</Text>
            {cart.length > 0 ? (
              <FlatList
                data={cart}
                keyExtractor={(item) => item._id || item.id || Math.random().toString()}
                renderItem={({ item }) => <CartItemCard item={item} onUpdateQty={updateQty} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 180 }}
              />
            ) : (
              <View className="items-center justify-center flex-1 pb-20">
                <View className="items-center justify-center w-40 h-40 mb-4 bg-gray-100 rounded-full opacity-80">
                  <PackageOpen size={64} color="#9CA3AF" />
                </View>
                <Text className="mb-1 text-lg font-bold text-gray-800">Keranjang Kosong</Text>
                <Text className="px-10 text-center text-gray-400">Gunakan kolom pencarian di atas untuk menambahkan produk ke pesanan.</Text>
              </View>
            )}
          </>
        )}
      </View>

      {!isSearching && cart.length > 0 && <CashierFooter totalQty={getTotalQty()} totalPrice={getTotalPrice()} onClear={clearCart} onPay={handlePay} />}

      <Modal visible={showScanner} animationType="slide" onRequestClose={() => setShowScanner(false)} presentationStyle="fullScreen">
        <BarcodeScanner onScanned={handleScan} onClose={() => setShowScanner(false)} />
      </Modal>
    </ScreenWrapper>
  );
}
