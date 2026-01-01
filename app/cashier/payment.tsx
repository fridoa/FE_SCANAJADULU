import ScreenWrapper from "@/components/ScreenWrapper";
import transactionService from "@/services/transaction.service";
import { useCartStore } from "@/stores/cartStore";
import { ITransaction } from "@/types/Transaction";
import formatRupiah from "@/utils/formatRupiah";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { ArrowLeft, Save } from "lucide-react-native";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function PaymentScreen() {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();
  const animation = useRef<LottieView>(null);

  const [moneyReceived, setMoneyReceived] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  const receivedAmount = parseInt(moneyReceived.replace(/\D/g, "") || "0", 10);
  const returnAmount = receivedAmount - totalPrice;
  const isValid = receivedAmount >= totalPrice;

  const suggestions = [totalPrice, Math.ceil(totalPrice / 5000) * 5000, Math.ceil(totalPrice / 10000) * 10000, Math.ceil(totalPrice / 50000) * 50000, 50000, 100000]
    .filter((amount, index, self) => amount >= totalPrice && self.indexOf(amount) === index)
    .slice(0, 4);

  const handleProcessPayment = async () => {
    if (!isValid) {
      Alert.alert("Error", "Jumlah uang kurang!");
      return;
    }

    setIsSubmitting(true);

    const transactionData: ITransaction = {
      transaction_date: new Date(),
      total_price: totalPrice,
      money_receive: receivedAmount,
      money_return: returnAmount,
      items: cart.map((item) => ({
        product_id: item._id || "",
        name: item.name,
        current_price: Number(item.price),
        quantity: item.qty,
        subtotal: Number(item.price) * item.qty,
      })),
    };

    console.log("Payload Transaksi:", JSON.stringify(transactionData, null, 2));

    try {
      await transactionService.create(transactionData);

      setIsSubmitting(false);

      setShowSuccessAnim(true);

      animation.current?.play();

      setTimeout(() => {
        setShowSuccessAnim(false);
        clearCart();

        router.replace({
          pathname: "/cashier/success",
          params: {
            data: JSON.stringify(transactionData),
          },
        });
      }, 2500);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error processing transaction:", error);
      Alert.alert("Gagal", "Terjadi kesalahan saat memproses transaksi.");
    }
  };

  return (
    <ScreenWrapper>
      <View className="flex-row items-center justify-between px-4 py-3 bg-white shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">Tunai</Text>
        </View>
        <Text className="text-lg font-bold text-green-600">{formatRupiah(totalPrice)}</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="p-4 mb-6 bg-white shadow-sm rounded-xl">
          <Text className="mb-2 text-sm text-gray-500">Jumlah yang diterima</Text>
          <View className="flex-row items-center px-4 py-3 bg-gray-100 rounded-lg">
            <Text className="mr-2 text-lg font-bold text-gray-500">Rp</Text>
            <TextInput className="flex-1 text-xl font-bold text-gray-800" keyboardType="number-pad" value={moneyReceived} onChangeText={setMoneyReceived} placeholder="0" autoFocus editable={!isSubmitting} />
          </View>
        </View>

        <TouchableOpacity onPress={handleProcessPayment} disabled={!isValid || isSubmitting} className={`flex-row items-center justify-center p-4 mb-4 rounded-xl shadow-sm ${isValid && !isSubmitting ? "bg-emerald-700" : "bg-gray-300"}`}>
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Save size={20} color="white" className="mr-2" />
              <Text className="text-lg font-bold text-white">Terima Pembayaran</Text>
            </>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center justify-between mb-8">
          <Text className="text-base font-medium text-gray-800">Kembalian:</Text>
          <Text className={`text-xl font-bold ${returnAmount < 0 ? "text-gray-400" : "text-red-500"}`}>{formatRupiah(Math.max(0, returnAmount))}</Text>
        </View>

        <Text className="mb-3 text-sm font-bold text-gray-800">Jumlah Lain</Text>
        <View className="flex-row flex-wrap justify-between">
          {suggestions.map((amount, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setMoneyReceived(amount.toString())}
              className="w-[48%] p-4 mb-3 bg-white border border-gray-200 rounded-xl items-center justify-center active:bg-emerald-50 active:border-emerald-500"
            >
              <Text className="text-base font-bold text-gray-700">{formatRupiah(amount)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showSuccessAnim} transparent={false} animationType="fade" statusBarTranslucent={true}>
        <View className="items-center justify-center flex-1 bg-white">
          <LottieView ref={animation} source={require("@/assets/animations/SuccessPayment.json")} autoPlay loop={false} style={{ width: 300, height: 300 }} resizeMode="contain" />
          <Text className="mt-8 text-2xl font-bold text-center text-gray-800">Pembayaran Berhasil!</Text>
          <Text className="mt-2 text-gray-500">Mohon tunggu sebentar...</Text>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
