import { useState } from "react";
import ChatIcons from "~icons/ph/chat-circle-text-fill";
import ChatBox from "./ChatBox";

export default function ChatRoom() {
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckBox = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="fixed bottom-10 right-10" onClick={handleCheckBox}>
        <ChatIcons className=" h-24 w-24 cursor-pointer text-cyan-800" />
      </div>
      {isOpen && <ChatBox />}
    </>
  );
}
