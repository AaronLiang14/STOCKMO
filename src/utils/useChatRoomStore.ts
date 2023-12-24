import { create } from "zustand";

const chatRoomInitialState = {
  roomID: "1102",
  isAllRoom: false,
  isIndependentRoom: false,
};

interface ChatRoomProps {
  roomID: string;
  isAllRoom: boolean;
  isIndependentRoom: boolean;
  changeRoomID: (id: string) => void;
  switchToAllRoom: (boolean: boolean) => void;
  switchToIndependentRoom: (boolean: boolean) => void;
}

const useChatRoomStore = create<ChatRoomProps>((set) => ({
  ...chatRoomInitialState,
  changeRoomID: (id: string) => {
    set({ roomID: id });
  },

  switchToAllRoom: (boolean) => {
    set({ isAllRoom: boolean });
  },

  switchToIndependentRoom: (boolean) => {
    set({ isIndependentRoom: boolean });
  },
}));

export default useChatRoomStore;
