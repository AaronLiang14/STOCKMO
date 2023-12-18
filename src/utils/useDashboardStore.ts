import { doc, getDoc } from "firebase/firestore";
import { ColorString } from "highcharts";
import { create } from "zustand";
import { auth, db } from "../config/firebase";

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
  deleteUnLoginLayout: (id: ColorString) => void;
}

const initialState = {
  layout: [],
  unLoginLayout: [],
};

const useDashboardStore = create<DashboardProps>((set) => ({
  ...initialState,
  getLatestLayout: async () => {
    if (!auth.currentUser) return;
    const memberRef = doc(db, "Member", auth.currentUser!.uid);
    const layout = await getDoc(memberRef);
    if (layout.exists()) {
      set({
        layout: layout
          .data()!
          .dashboard_layout.map((item: layoutProps) => item),
      });
    }
  },

  setUnLogInLayout: (layout: layoutProps[]) => {
    set({ unLoginLayout: layout });
  },

  deleteUnLoginLayout: (id: ColorString) => {
    const newLayout = initialState.unLoginLayout.filter(
      (item: layoutProps) => item.i !== id,
    );
    set({ unLoginLayout: newLayout });
  },
}));

export default useDashboardStore;
