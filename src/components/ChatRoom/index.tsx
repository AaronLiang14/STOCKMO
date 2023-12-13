import { auth } from "@/config/firebase";
import useChatRoomStore from "@/utils/useChatRoomStore";
import { useReducer } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ChatIcons from "~icons/ph/chat-circle-text-fill";
import ChatBox from "./ChatBox";

interface State {
  isOpen: boolean;
}
export default function ChatRoom() {
  type Action = { type: "TOGGLE" };
  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case "TOGGLE":
        return { isOpen: !state.isOpen };
      default:
        return state;
    }
  };
  const { id } = useParams();

  const [state, dispatch] = useReducer(reducer, { isOpen: false });
  const {
    changeIsAllRoom,
    isAllRoom,
    isIndependentRoom,
    changeIsIndependentRoom,
    changeRoomID,
  } = useChatRoomStore();

  const handleCheckBox = () => {
    if (!auth.currentUser) {
      toast.error("登入後即可使用聊天室");

      return;
    }
    if (isAllRoom || isIndependentRoom) {
      changeIsAllRoom(false);
      changeIsIndependentRoom(false);
    }

    if (id) {
      changeIsIndependentRoom(true);
      changeRoomID(id);
    } else {
      changeIsAllRoom(true);
    }
    dispatch({ type: "TOGGLE" });
  };

  return (
    <>
      <div
        className="fixed bottom-10 right-10 z-50  rounded-lg border bg-white shadow-inner"
        onClick={handleCheckBox}
      >
        <ChatIcons className=" h-16 w-16 cursor-pointer  text-cyan-800 " />
      </div>
      {state.isOpen && <ChatBox dispatch={dispatch} />}
    </>
  );
}
