import timeSelector from "@/components/Graph/TimeSelect";
import api from "@/utils/api";
import { create } from "zustand";

const initialState = {
  stockID: "",
  trade: "現股",
  order: "ROD",
  buySell: "買",
  unit: "",
  price: 0,
  volume: 0,
  flatPrice: 0,
  marketPrice: 0,
};

interface OrderProps {
  stockID: string;
  trade: string;
  order: string;
  buySell: string;
  unit: string;
  price: number;
  volume: number;
  flatPrice: number;
  marketPrice: number;
  getHistoryData: (stockID: string) => void;
  getMarketPrice: (stockID: string) => void;
  setStockID: (stockID: string) => void;
  setTrade: (trade: string) => void;
  setOrder: (order: string) => void;
  setBuySell: (buySell: string) => void;
  setUnit: (unit: string) => void;
  setPrice: (price: number) => void;
  setVolume: (volume: number) => void;
  clear: () => void;
}

const useOrderStore = create<OrderProps>((set) => ({
  ...initialState,

  getHistoryData: async (stockID: string) => {
    if (stockID.length === 4) {
      const res = await api.getHistoryStockPrice(
        stockID,
        timeSelector.lastOpeningDate,
        timeSelector.endDate,
      );
      set({ flatPrice: res.data[0].close });
    }
  },

  getMarketPrice: async (stockID: string) => {
    if (stockID.length === 4) {
      const res = await api.getTaiwanStockPriceTick(stockID);
      set({ marketPrice: res.data[0].close });
    }
  },

  setStockID: (stockID: string) => set({ stockID: stockID }),
  setTrade: (trade: string) => set({ trade: trade }),
  setOrder: (order: string) => set({ order: order }),
  setBuySell: (buySell: string) => set({ buySell: buySell }),
  setUnit: (unit: string) => set({ unit: unit }),
  setPrice: (price: number) => set({ price: price }),
  setVolume: (volume: number) => set({ volume: volume }),

  clear: () => set({ ...initialState }),
}));

export { useOrderStore };
