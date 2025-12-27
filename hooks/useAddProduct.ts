import mediaService from "@/services/media.service";
import productService from "@/services/product.service";
import { IProduct } from "@/types/Product";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import * as yup from "yup";

const productSchema = yup.object().shape({
  name: yup.string().required("Nama produk wajib diisi"),
  category: yup.string().optional(),
  price: yup.string().required("Harga produk wajib diisi"),
  cost_price: yup.string().optional(),
  sku: yup.string().optional(),
  stock: yup.string().optional(),
  image_url: yup.string().optional(),
});

export const useAddProduct = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showScanner, setShowScanner] = useState(false);
  const [enableDetails, setEnableDetails] = useState(true);
  const [enableStock, setEnableStock] = useState(true);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      price: "",
      cost_price: "",
      sku: "",
      stock: "",
      image_url: "",
    },
  });

  const handleScan = (sku: string) => {
    setValue("sku", sku);
    setShowScanner(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const mutation = useMutation({
    mutationFn: (newProduct: Partial<IProduct>) => productService.createProduct(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      Alert.alert("Sukses", "Produk berhasil ditambahkan");
      router.back();
    },
    onError: (error) => {
      console.error(error);
      Alert.alert("Error", "Gagal menambahkan produk");
    },
  });

  const onSubmit = async (data: IProduct) => {
    let imageUrl = "";

    if (selectedImage) {
      setIsUploading(true);
      try {
        imageUrl = await mediaService.uploadImage(selectedImage);
      } catch (error) {
        console.error("Upload failed", error);
        Alert.alert("Error", "Gagal mengupload gambar");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    if (enableDetails && !data.sku) {
      Alert.alert("Error", "SKU wajib diisi jika detail produk diaktifkan");
      return;
    }

    const payload = {
      name: data.name,
      category: data.category ? data.category.trim() : "",
      sku: data.sku,
      price: Number(data.price),
      cost_price: data.cost_price ? Number(data.cost_price) : 0,
      stock: enableStock ? Number(data.stock) : 0,
      image_url: imageUrl,
    };

    console.log("Payload yang dikirim:", JSON.stringify(payload, null, 2)); // Debugging

    mutation.mutate(payload);
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    errors,
    pickImage,
    selectedImage,
    isSubmitting: mutation.isPending || isUploading,
    showScanner,
    setShowScanner,
    enableDetails,
    setEnableDetails,
    enableStock,
    setEnableStock,
    handleScan,
  };
};
