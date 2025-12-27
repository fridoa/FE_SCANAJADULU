import { axiosInstance } from "@/libs/axios/instance";
import { ITransaction } from "@/types/Transaction";
import endpoint from "./endpoint.constant";

type TransactionPayload = Omit<ITransaction, "_id" | "createdAt" | "updatedAt">;

const transactionService = {
  getTransactions: (params?: string) => axiosInstance.get(params ? `${endpoint.TRANSACTION}?${params}` : endpoint.TRANSACTION),

  create: (payload: TransactionPayload) => axiosInstance.post(endpoint.TRANSACTION, payload),
};

export default transactionService;
