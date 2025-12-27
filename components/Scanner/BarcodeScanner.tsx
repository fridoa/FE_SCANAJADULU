import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import ScannerOverlay from "./ScannerOverlay";

interface BarcodeScannerProps {
  onScanned: (data: string, type: string) => void;
  onClose?: () => void;
}

export default function BarcodeScanner({ onScanned, onClose }: BarcodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanned, setIsScanned] = useState(false);

  useEffect(() => {
    setIsScanned(false);
  }, []);

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="items-center justify-center flex-1 p-5 bg-black">
        <Text className="mb-4 text-lg text-center text-white">Izinkan kamera untuk memindai kode batang.</Text>
        <Button onPress={requestPermission} title="Izinkan Kamera" />
        {onClose && (
          <TouchableOpacity onPress={onClose} className="mt-8">
            <Text className="font-bold text-red-400">Kembali</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (isScanned) return;
    setIsScanned(true);
    onScanned(result.data, result.type);
    setTimeout(() => setIsScanned(false), 2000); // Allow scanning again after 2 seconds
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        facing="back"
        onBarcodeScanned={handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code128", "code39"],
        }}
      />
      <ScannerOverlay />

      {onClose && (
        <View className="absolute left-0 right-0 items-center bottom-12">
          <TouchableOpacity onPress={onClose} className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-md">
            <Text className="font-bold text-white">Batal Scan</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
