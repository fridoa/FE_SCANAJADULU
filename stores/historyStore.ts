import transactionService from "@/services/transaction.service";
import { ITransaction } from "@/types/Transaction";
import { create } from "zustand";

interface HistoryState {
  data: ITransaction[];
  isLoading: boolean;
  isError: boolean;

  fetchHistory: (forceUpdate?: boolean) => Promise<void>;
  reset: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  data: [],
  isLoading: false,
  isError: false,

  fetchHistory: async (forceUpdate = false) => {
    set({ isLoading: true, isError: false });

    try {
      const response = await transactionService.getTransactions();
      const rawData = Array.isArray(response.data) ? response.data : response.data.data || [];
      const sortedData = rawData.sort((a: ITransaction, b: ITransaction) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
      set({ data: sortedData , isLoading: false });
    } catch (error) {
      console.error("History fetch error:", error);
      set({ isError: true, isLoading: false });
    }
  },

  reset: () => set({ data: [], isLoading: false, isError: false }),
}));
