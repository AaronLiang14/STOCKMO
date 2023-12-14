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
  changeIsAllRoom: (boolean: boolean) => void;
  changeIsIndependentRoom: (boolean: boolean) => void;
}

const useChatRoomStore = create<ChatRoomProps>((set) => ({
  ...chatRoomInitialState,
  changeRoomID: (id: string) => {
    set({ roomID: id });
  },

  changeIsAllRoom: (boolean) => {
    set({ isAllRoom: boolean });
  },

  changeIsIndependentRoom: (boolean) => {
    set({ isIndependentRoom: boolean });
  },
}));

export default useChatRoomStore;
