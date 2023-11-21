import { useReducer } from "react";
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
  const [state, dispatch] = useReducer(reducer, { isOpen: false });

  const handleCheckBox = () => {
    dispatch({ type: "TOGGLE" });
  };

  return (
    <>
      <div className="fixed bottom-10 right-10" onClick={handleCheckBox}>
        <ChatIcons className=" h-16 w-16 cursor-pointer text-cyan-800" />
      </div>
      {state.isOpen && <ChatBox dispatch={dispatch} />}
    </>
  );
}
