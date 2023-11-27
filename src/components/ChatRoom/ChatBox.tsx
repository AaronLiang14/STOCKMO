import { auth, db } from "@/config/firebase";
import {
  arrayUnion,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Close from "~icons/ion/close-round";
import { MyMessage, OtherMessage } from "./Messages";

interface Message {
  member_id: string;
  text: string;
  message_time: Date;
  name: string;
  avatar: string;
}

interface ChatBoxProps {
  dispatch: React.Dispatch<{ type: "TOGGLE" }>;
}

export default function ChatBox({ dispatch }: ChatBoxProps) {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");

  const newMessage = {
    member_id: auth.currentUser!.uid,
    text: input,
    message_time: new Date(),
    name: auth.currentUser?.displayName,
    avatar: auth.currentUser?.photoURL,
  };

  const handleSendMessage = async () => {
    if (input === "" || !id) return;
    const chatRoomsRef = doc(db, "ChatRooms", id);
    await updateDoc(chatRoomsRef, {
      messages: arrayUnion(newMessage),
    });
    setInput("");
  };

  const handleCheckBox = () => {
    dispatch({ type: "TOGGLE" });
  };

  useEffect(() => {
    const chatRoomsRef = doc(db, "ChatRooms", id!);
    onSnapshot(chatRoomsRef, (doc) => {
      if (doc.data() === undefined) {
        setDoc(chatRoomsRef, {
          messages: [],
        });
      } else {
        setMessages(doc.data()?.messages);
      }
    });
  }, []);

  return (
    <>
      <div className="fixed bottom-32 right-16  w-96">
        <div className="w-full max-w-lg rounded-lg bg-white shadow-md">
          <div className="flex items-center justify-between rounded-t-lg border-b bg-cyan-800 p-4 text-white">
            <p className="text-lg font-semibold">聊天室</p>
            <Close onClick={handleCheckBox} className="cursor-pointer" />
          </div>
          <div className="h-80 overflow-y-auto p-4">
            {messages.map((message, index) => {
              if (message.member_id === auth.currentUser!.uid) {
                return MyMessage(
                  message.text,
                  index,
                  message.name,
                  message.avatar,
                );
              } else {
                return OtherMessage(
                  message.text,
                  index,
                  message.name,
                  message.avatar,
                );
              }
            })}
          </div>
          <div className="flex border-t p-4">
            <input
              id="user-input"
              type="text"
              placeholder="Type a message"
              className="w-full rounded-l-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-800"
              required
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <button
              id="send-button"
              className="rounded-r-md bg-cyan-800 px-4 py-2 text-white transition duration-300 hover:bg-cyan-900"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
