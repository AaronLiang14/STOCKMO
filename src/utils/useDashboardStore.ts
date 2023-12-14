import { doc, getDoc } from "firebase/firestore";
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
  getLatestLayout: () => void;
}

const useDashboardStore = create<DashboardProps>((set) => ({
  layout: [],
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
}));

export default useDashboardStore;
