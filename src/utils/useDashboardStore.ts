import { create } from "zustand";
import { auth } from "../config/firebase";
import firestoreApi from "./firestoreApi";

interface layoutProps {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}
interface DashboardProps {
  layout: layoutProps[];
  unLoginLayout: layoutProps[];
  getLatestLayout: () => void;
  setUnLogInLayout: (layout: layoutProps[]) => void;
  deleteUnLoginLayout: (id: string, layout: layoutProps[]) => void;
}

const initialState = {
  layout: [],
  unLoginLayout: [],
};

const useDashboardStore = create<DashboardProps>((set) => ({
  ...initialState,
  getLatestLayout: async () => {
    if (!auth.currentUser) return;
    const memberData = await firestoreApi.getMemberInfo(auth.currentUser!.uid);
    set({
      layout: memberData?.dashboard_layout.map((item: layoutProps) => item),
    });
  },

  setUnLogInLayout: (layout: layoutProps[]) => {
    set({ unLoginLayout: layout });
  },

  deleteUnLoginLayout: (id: string, layout: layoutProps[]) => {
    const newLayout = layout.filter((item: layoutProps) => item.i !== id);
    set({ unLoginLayout: newLayout });
  },
}));

export default useDashboardStore;
