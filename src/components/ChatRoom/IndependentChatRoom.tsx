import { auth, db } from "@/config/firebase";
import firestoreApi from "@/utils/firestoreApi";
import useChatRoomStore from "@/utils/useChatRoomStore";
import { Timestamp, doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MyMessage, OtherMessage } from "./Messages";
interface Message {
  member_id: string;
  text: string;
  message_time: Timestamp;
  name: string;
  avatar: string;
}

export default function IndependentChatRoom({ id }: { id: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);
  const { roomID } = useChatRoomStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (input === "" || !id) return;
    const newMessage = {
      member_id: auth.currentUser!.uid,
      text: input,
      message_time: new Date(),
      name: auth.currentUser?.displayName,
      avatar: auth.currentUser?.photoURL,
      room_id: id,
    };
    try {
      await firestoreApi.sendNewMessage(id, newMessage);
      setInput("");
    } catch (error) {
      toast.error("請先登入");
    }
  };

  useEffect(() => {
    const chatRoomsRef = doc(db, "ChatRooms", id!);
    const unsubscribe = onSnapshot(chatRoomsRef, (doc) => {
      if (doc.data() === undefined) {
        setDoc(chatRoomsRef, {
          messages: [],
        });
        return;
      }
      setMessages(doc.data()?.messages);
    });
    return () => {
      unsubscribe();
    };
  }, [roomID]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className=" rounded-b-lg border-1 bg-white shadow-lg">
      <div className="h-80 overflow-y-auto p-4 ">
        {messages.map((message, index) => {
          if (message.member_id === auth.currentUser!.uid) {
            return MyMessage(
              message.text,
              index,
              message.name,
              message.avatar,
              message.message_time.toDate().toLocaleTimeString(),
              messagesEndRef,
            );
          }
          return OtherMessage(
            message.text,
            index,
            message.name,
            message.avatar,
            message.message_time.toDate().toLocaleTimeString(),
            messagesEndRef,
          );
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
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isComposing) {
              handleSendMessage();
            }
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
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
  );
}
