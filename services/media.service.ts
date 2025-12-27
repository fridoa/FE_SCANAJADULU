import { axiosInstance } from "@/libs/axios/instance";
import endpoint from "./endpoint.constant";

const mediaService = {
  uploadImage: async (uri: string): Promise<string> => {
    const formData = new FormData();
    const filename = uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename as string);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append("file", {
      uri,
      name: filename,
      type,
    } as any);

    const response = await axiosInstance.post(endpoint.MEDIA, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data.url;
  },
};

export default mediaService;
