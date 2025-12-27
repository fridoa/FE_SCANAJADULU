import BarcodeScanner from "@/components/Scanner/BarcodeScanner";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAddProduct } from "@/hooks/useAddProduct";
import { useRouter } from "expo-router";
import { ArrowLeft, ImageIcon, ScanLine } from "lucide-react-native";
import { Controller } from "react-hook-form";
import { ActivityIndicator, Image, Modal, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddProductScreen() {
  const router = useRouter();
  const { control, handleSubmit, handleScan, pickImage, selectedImage, showScanner, setShowScanner, enableDetails, setEnableDetails, enableStock, setEnableStock, isSubmitting, onSubmit, errors } = useAddProduct();

  return (
    <ScreenWrapper>
      <View className="flex-1 bg-gray-50">
        <View className="flex-row items-center px-4 py-4 pt-12 bg-white shadow-sm">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">Tambah Produk</Text>
        </View>

        <ScrollView className="flex-1 p-4">
          <View className="items-center mb-6">
            <View className="items-center justify-center w-32 h-32 mb-2 overflow-hidden bg-gray-200 border border-gray-300 border-dashed rounded-xl">
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} className="w-full h-full" />
              ) : (
                <>
                  <ImageIcon size={40} color="#9CA3AF" />
                  <Text className="mt-2 text-xs text-gray-500">No Image</Text>
                </>
              )}
            </View>
            <TouchableOpacity onPress={pickImage} className="px-6 py-2 bg-gray-800 rounded-lg">
              <Text className="text-xs font-medium text-white">{selectedImage ? "Ganti Gambar" : "Pilih Gambar"}</Text>
            </TouchableOpacity>
          </View>

          <View className="p-4 mb-4 bg-white shadow-sm rounded-xl">
            <Text className="mb-1 text-xs text-gray-500">Nama Produk *</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput className={`border rounded-lg p-3 mb-1 text-gray-800 bg-gray-50 ${errors.name ? "border-red-500" : "border-gray-200"}`} onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
            {errors.name && <Text className="text-xs text-red-500">{errors.name.message}</Text>}

            <Text className="mt-3 mb-1 text-xs text-gray-500">Kategori</Text>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput className="p-3 mb-1 text-gray-800 border border-gray-200 rounded-lg bg-gray-50" placeholder="Contoh: Makanan, Minuman" onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />

            <Text className="mt-3 mb-1 text-xs text-gray-500">Harga Jual *</Text>
            <View className="flex-row items-center mb-1 overflow-hidden border border-gray-200 rounded-lg bg-gray-50">
              <View className="px-4 py-3 bg-gray-200">
                <Text className="font-bold text-gray-600">Rp</Text>
              </View>
              <Controller control={control} name="price" render={({ field: { onChange, onBlur, value } }) => <TextInput className="flex-1 p-3 text-gray-800" placeholder="0" keyboardType="numeric" onChangeText={onChange} value={value} />} />
            </View>
            {errors.price && <Text className="mb-3 text-xs text-red-500">{errors.price.message}</Text>}
          </View>

          <View className="p-4 mb-4 bg-white shadow-sm rounded-xl">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-bold text-gray-800">Atur Harga Modal dan Barcode</Text>
              <Switch value={enableDetails} onValueChange={setEnableDetails} trackColor={{ false: "#E5E7EB", true: "#15803d" }} thumbColor={"#FFFFFF"} />
            </View>

            {enableDetails && (
              <>
                <Text className="mb-1 text-xs text-gray-500">Harga Modal</Text>
                <View className="flex-row items-center mb-4 overflow-hidden border border-gray-200 rounded-lg bg-gray-50">
                  <View className="px-4 py-3 bg-gray-200">
                    <Text className="font-bold text-gray-600">Rp</Text>
                  </View>
                  <Controller control={control} name="cost_price" render={({ field: { onChange, value } }) => <TextInput className="flex-1 p-3 text-gray-800" placeholder="0" keyboardType="numeric" onChangeText={onChange} value={value} />} />
                </View>

                <Text className="mb-1 text-xs text-gray-500">Kode Produk / Barcode (SKU)</Text>
                <View className="flex-row items-center mb-1 overflow-hidden border border-gray-200 rounded-lg bg-gray-50">
                  <Controller control={control} name="sku" render={({ field: { onChange, value } }) => <TextInput className="flex-1 p-3 text-gray-800" placeholder="Scan atau Ketik" onChangeText={onChange} value={value} />} />
                  <TouchableOpacity onPress={() => setShowScanner(true)} className="p-3 bg-white border-l border-gray-200">
                    <ScanLine size={24} color="#1F2937" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          <View className="p-4 mb-24 bg-white shadow-sm rounded-xl">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-bold text-gray-800">Atur Stock Produk</Text>
              <Switch value={enableStock} onValueChange={setEnableStock} trackColor={{ false: "#E5E7EB", true: "#15803d" }} thumbColor={"#FFFFFF"} />
            </View>

            {enableStock && (
              <>
                <Text className="mb-1 text-xs text-gray-500">Jumlah Stok</Text>
                <Controller
                  control={control}
                  name="stock"
                  render={({ field: { onChange, value } }) => <TextInput className="p-3 text-gray-800 border border-gray-200 rounded-lg bg-gray-50" placeholder="0" keyboardType="numeric" onChangeText={onChange} value={value} />}
                />
              </>
            )}
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
          <TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={isSubmitting} className={`py-4 rounded-full items-center shadow-md ${isSubmitting ? "bg-gray-400" : "bg-green-800"}`}>
            {isSubmitting ? <ActivityIndicator color="white" /> : <Text className="text-lg font-bold text-white">Simpan</Text>}
          </TouchableOpacity>
        </View>

        <Modal visible={showScanner} animationType="slide" onRequestClose={() => setShowScanner(false)}>
          <BarcodeScanner onScanned={handleScan} onClose={() => setShowScanner(false)} />
        </Modal>
      </View>
    </ScreenWrapper>
  );
}
